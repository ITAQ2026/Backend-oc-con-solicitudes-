import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm'; // Importa DeepPartial
import { OrdenTrabajo } from './entities/orden-trabajo.entity';

@Injectable()
export class OrdenesTrabajoRepository {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly repository: Repository<OrdenTrabajo>,
  ) {}

  async getAll(): Promise<OrdenTrabajo[]> {
    return this.repository.find({
      relations: ['vehiculo'],
      order: { id: 'DESC' },
    });
  }

  // Cambiamos Partial por DeepPartial para que acepte { vehiculo: { id: ... } }
  async saveOne(data: DeepPartial<OrdenTrabajo>): Promise<OrdenTrabajo> {
    const nuevaOT = this.repository.create(data);
    return this.repository.save(nuevaOT);
  }
}