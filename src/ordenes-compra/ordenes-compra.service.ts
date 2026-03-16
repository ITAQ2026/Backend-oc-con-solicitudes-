import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity'; // Asegura la ruta

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private repo: Repository<OrdenCompra>,
    private dataSource: DataSource, // Inyectamos DataSource para transacciones
  ) {}

  async create(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Procesar items
      let itemsProcesados = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

      // 2. Si hay una solicitud asociada, validamos su estado
      if (data.solicitudId) {
        const solicitud = await queryRunner.manager.findOne(Solicitud, {
          where: { id: Number(data.solicitudId) }
        });

        if (!solicitud) throw new NotFoundException('La solicitud no existe');
        if (solicitud.estado === 'APROBADO_Y_COMPRADO') {
          throw new BadRequestException('Esta solicitud ya fue utilizada en otra Orden de Compra');
        }

        // Actualizamos el estado de la solicitud dentro de la transacción
        solicitud.estado = 'APROBADO_Y_COMPRADO';
        await queryRunner.manager.save(solicitud);
      }

      // 3. Crear la Orden de Compra con los campos nuevos
      const nuevaOrden = queryRunner.manager.create(OrdenCompra, {
        proveedor: data.proveedor || data.proveedorNombre,
        fecha: new Date(),
        solicitudId: data.solicitudId ? Number(data.solicitudId) : undefined,
        autoriza: data.autoriza || 'LUCRECIA CAPÓ LLORENTE',
        retira: data.retira || '',
        
        // --- NUEVOS CAMPOS AGREGADOS ---
        plazoPago: data.plazoPago,
        formaPago: data.formaPago,
        direccionDescarga: data.direccionDescarga || 'PLANTA VILLA MARÍA',
        tiempoEstimado: data.tiempoEstimado,
        especificaciones: data.especificaciones,
        // -------------------------------

        items: itemsProcesados.map((i: any) => ({
          producto: i.producto,
          cantidad: Number(i.cantidad),
          precio: Number(i.precio || 0)
        }))
      } as any);

      const resultado = await queryRunner.manager.save(nuevaOrden);

      // Si todo salió bien, confirmamos los cambios en la DB
      await queryRunner.commitTransaction();
      return resultado;

    } catch (error) {
      // Si algo falló (ej: la solicitud ya estaba comprada), revertimos todo
      await queryRunner.rollbackTransaction();
      console.error("Error en transacción de OC:", error);
      throw new BadRequestException(error.message);
    } finally {
      // Liberamos el query runner
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