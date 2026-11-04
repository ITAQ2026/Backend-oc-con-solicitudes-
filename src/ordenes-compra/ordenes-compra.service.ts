import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    const { items, proveedorNombre, solicitudIds, ...resto } = datos;

    // Una orden puede agrupar varias solicitudes; se acepta también el campo viejo solicitudId
    const ids = [
      ...new Set(
        solicitudIds?.length
          ? solicitudIds
          : resto.solicitudId
            ? [resto.solicitudId]
            : [],
      ),
    ];

    try {
      return await this.ordenRepo.manager.transaction(async (manager) => {
        const solicitudes = ids.length
          ? await manager.findBy(Solicitud, { id: In(ids) })
          : [];
        if (solicitudes.length !== ids.length) {
          const encontradas = new Set(solicitudes.map((s) => s.id));
          const faltantes = ids.filter((id) => !encontradas.has(id));
          throw new BadRequestException(
            `No existen las solicitudes: ${faltantes.map((id) => `SC-${id}`).join(', ')}`,
          );
        }

        // TypeORM usa el 'cascade: true' de la Entity para guardar los items en su tabla
        const nuevaOrden = manager.create(OrdenCompra, {
          ...resto,
          solicitudId: ids[0] ?? undefined,
          proveedor: proveedorNombre,
          items: items,
          solicitudes,
          fecha: new Date(),
        });
        const ordenGuardada = await manager.save(nuevaOrden);

        if (ids.length) {
          await manager.update(Solicitud, { id: In(ids) }, {
            estado: 'COMPRADO',
          } as any);
        }
        return ordenGuardada;
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
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
      relations: ['items', 'solicitud', 'solicitudes'],
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
