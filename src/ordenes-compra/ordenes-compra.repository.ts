import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';

@Injectable()
export class OrdenesCompraRepository extends Repository<OrdenCompra> {
  constructor(private dataSource: DataSource) {
    super(OrdenCompra, dataSource.createEntityManager());
  }

  async obtenerHistorial() {
    return await this.find({
      order: { id: 'DESC' }
    });
  }
}