import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrdenPago } from './entities/orden-pago.entity';

@Injectable()
export class OrdenesPagoRepository extends Repository<OrdenPago> {
  constructor(private dataSource: DataSource) {
    super(OrdenPago, dataSource.createEntityManager());
  }

  async listarConDetalles() {
    try {
      // Intentamos un find simple primero
      return await this.find({
        order: { id: 'DESC' }
      });
    } catch (error) {
      console.error("DETALLE DEL ERROR EN DB:", error);
      throw error; // Esto enviará el detalle a los logs de Render
    }
  }
}