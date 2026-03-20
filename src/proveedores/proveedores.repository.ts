import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';

@Injectable()
export class ProveedoresRepository extends Repository<Proveedor> {
  constructor(private dataSource: DataSource) {
    super(Proveedor, dataSource.createEntityManager());
  }

  async listarAlfabeticamente() {
    return await this.find({ order: { nombre: 'ASC' } });
  }
}