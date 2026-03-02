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

  async create(data: any) {
    try {
      let itemsProcesados: any[] = [];
      if (data.items) {
        itemsProcesados = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
      }

      // Usamos 'as any' para evitar que TS bloquee el despliegue por tipos estrictos
      const nuevaOrden = this.repo.create({
        proveedor: data.proveedor || data.proveedorNombre,
        fecha: new Date(),
        // Usamos undefined en lugar de null para cumplir con la Entity
        solicitudId: data.solicitudId ? Number(data.solicitudId) : undefined,
        autoriza: data.autoriza || 'LUCRECIA CAPÓ LLORENTE',
        retira: data.retira || '',
        condicionPago: data.condicionPago || '',
        items: itemsProcesados.map((i: any) => ({
          producto: i.producto,
          cantidad: Number(i.cantidad),
          precio: Number(i.precio || 0)
        }))
      } as any);

      return await this.repo.save(nuevaOrden);
    } catch (error) {
      console.error("Error al crear orden:", error);
      throw new BadRequestException("Error al guardar la orden: " + error.message);
    }
  }

  async findAll() {
    return await this.repo.find({
      relations: ['items', 'solicitud'],
      order: { id: 'DESC' }
    });
  }
}