import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Recibo } from './entities/recibo.entity';

@Injectable()
export class RecibosRepository extends Repository<Recibo> {
  constructor(private dataSource: DataSource) {
    super(Recibo, dataSource.createEntityManager());
  }

  async buscarPorOrden(ordenId: number) {
    return await this.find({
      where: { orden_id: ordenId },
      order: { fecha_registro: 'DESC' }
    });
  }
}