import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrdenPago } from './entities/orden-pago.entity';

@Injectable()
export class OrdenesPagoRepository extends Repository<OrdenPago> {
  constructor(private dataSource: DataSource) {
    super(OrdenPago, dataSource.createEntityManager());
  }

  async listarConDetalles() {
    return await this.find({
      relations: ['orden_compra'],
      order: { id: 'DESC' }
    });
  }
}