import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenRepo: Repository<OrdenCompra>,

    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(datos: CreateOrdenDto) {
    try {
      const { items, proveedorNombre, ...resto } = datos;

      // 1. Creamos la instancia de la orden mapeando 'proveedor'
      // IMPORTANTE: Aquí pasamos el array de items tal cual,
      // TypeORM usará el 'cascade: true' de tu Entity para guardarlos en la otra tabla.
      const nuevaOrden = this.ordenRepo.create({
        ...resto,
        proveedor: proveedorNombre,
        items: items, // Array de objetos, NO string
        fecha: new Date(),
      });

      const ordenGuardada = await this.ordenRepo.save(nuevaOrden);

      if (datos.solicitudId) {
        // Esto actualiza la base de datos directamente
        await this.solicitudRepo.update(datos.solicitudId, {
          estado: 'COMPRADO',
        } as any);
      }
      return ordenGuardada;
    } catch (error) {
      console.error('Detalle error DB:', error);
      throw new BadRequestException(
        'Error al generar la Orden: ' + error.message,
      );
    }
  }

  async findAll(adminId = 0) {
    const usuario = adminId
      ? await this.usuarioRepo.findOne({ where: { id: adminId } })
      : null;
    const esAdminPrincipal =
      (usuario?.email || '').toLowerCase().trim() === 'admin@sistema.com';
    const where = esAdminPrincipal ? {} : { oculto_para_admins: false };
    // Usamos 'relations' para que el historial traiga también los productos de cada orden
    return await this.ordenRepo.find({
      where,
      relations: ['items', 'solicitud'],
      order: { id: 'DESC' },
    });
  }

  async ocultarParaAdmins(id: number, adminId: number) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: adminId } });
    if ((usuario?.email || '').toLowerCase().trim() !== 'admin@sistema.com') {
      throw new BadRequestException(
        'Solo admin@sistema.com puede ocultar órdenes de compra.',
      );
    }

    await this.ordenRepo.update(id, {
      oculto_para_admins: true,
      ocultado_por_email: usuario?.email || 'admin@sistema.com',
    });

    return { ok: true };
  }
}
