import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private repo: Repository<OrdenCompra>,
    private dataSource: DataSource,
  ) {}

  async create(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let itemsProcesados = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

      if (data.solicitudId) {
        const solicitud = await queryRunner.manager.findOne(Solicitud, {
          where: { id: Number(data.solicitudId) }
        });

        if (!solicitud) throw new NotFoundException('La solicitud no existe');
        if (solicitud.estado === 'APROBADO_Y_COMPRADO') {
          throw new BadRequestException('Esta solicitud ya fue utilizada en otra Orden de Compra');
        }

        solicitud.estado = 'APROBADO_Y_COMPRADO';
        await queryRunner.manager.save(solicitud);
      }

      const nuevaOrden = queryRunner.manager.create(OrdenCompra, {
        proveedor: data.proveedor || data.proveedorNombre,
        fecha: new Date(),
        solicitudId: data.solicitudId ? Number(data.solicitudId) : undefined,
        autoriza: data.autoriza || 'LUCRECIA CAPÓ LLORENTE',
        retira: data.retira || '',
        
        plazoPago: data.plazoPago,
        formaPago: data.formaPago,
        direccionDescarga: data.direccionDescarga || 'Av Brigadier Gral San Martin 235 - 5900 Villa María - Cba.',
        tiempoEstimado: data.tiempoEstimado,
        especificaciones: data.especificaciones,

        // --- CAMBIO CLAVE: PRECIO OPCIONAL ---
        items: itemsProcesados.map((i: any) => ({
          producto: i.producto,
          cantidad: Number(i.cantidad),
          // Si el precio es null, undefined o "", se guarda como null en la DB
          precio: (i.precio === '' || i.precio === null || i.precio === undefined) 
                   ? null 
                   : Number(i.precio)
        }))
      } as any);

      const resultado = await queryRunner.manager.save(nuevaOrden);
      await queryRunner.commitTransaction();
      return resultado;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.repo.find({
      relations: ['items', 'solicitud'],
      order: { id: 'DESC' }
    });
  }
}