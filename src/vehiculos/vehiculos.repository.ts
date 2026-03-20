import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculos.entity';

@Injectable()
export class VehiculosRepository extends Repository<Vehiculo> {
  constructor(private dataSource: DataSource) {
    super(Vehiculo, dataSource.createEntityManager());
  }

  async buscarPorPatente(patente: string) {
    return await this.findOne({ where: { patente: patente.toUpperCase() } });
  }
}