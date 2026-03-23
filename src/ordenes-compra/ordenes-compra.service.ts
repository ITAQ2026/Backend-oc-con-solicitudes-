import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { OrdenCompraItem } from './entities/orden-compra-item.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenRepo: Repository<OrdenCompra>,
    
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
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

      // 2. Si hay una solicitud vinculada, la marcamos como COMPRADO
      if (datos.solicitudId) {
        await this.solicitudRepo.update(datos.solicitudId, {
          estado: 'COMPRADO'
        } as any);
      }

      return ordenGuardada;
    } catch (error) {
      console.error("Detalle error DB:", error);
      throw new BadRequestException("Error al generar la Orden: " + error.message);
    }
  }

  async findAll() {
    // Usamos 'relations' para que el historial traiga también los productos de cada orden
    return await this.ordenRepo.find({
      relations: ['items'],
      order: { id: 'DESC' }
    });
  }
}