import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private repo: Repository<OrdenCompra>,
  ) {}

// backend > src > ordenes-compra > ordenes-compra.service.ts

async create(data: any) {
  try {
    let itemsProcesados = [];
    if (data.items) {
      itemsProcesados = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    // 2. Mapear los datos para que coincidan con la Entity
    const nuevaOrden = this.repo.create({
      proveedor: data.proveedor || data.proveedorNombre,
      fecha: new Date(),
      solicitudId: data.solicitudId ? Number(data.solicitudId) : null,
      
      // AGREGAR ESTOS CAMPOS AQUÍ:
      autoriza: data.autoriza || 'LUCRECIA CAPÓ LLORENTE',
      retira: data.retira || '',
      condicionPago: data.condicionPago || '',
      observaciones: data.observaciones || '',

      // Mapeo de items
      items: itemsProcesados.map(i => ({
        producto: i.producto,
        cantidad: Number(i.cantidad),
        precio: Number(i.precio || 0)
      }))
    });

    return await this.repo.save(nuevaOrden);
  } catch (error) {
    console.error("Error al crear orden:", error);
    throw new Error("Error interno del servidor");
  }
}

  async findAll() {
    // IMPORTANTE: relations: ['items'] es lo que hace que aparezcan en el historial
    return await this.repo.find({
      relations: ['items', 'solicitud'],
      order: { id: 'DESC' }
    });
  }
}