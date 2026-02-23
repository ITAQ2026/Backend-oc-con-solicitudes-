import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private repo: Repository<Proveedor>,
  ) {}

  findAll() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  create(data: Partial<Proveedor>) {
    const nuevo = this.repo.create(data);
    return this.repo.save(nuevo);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}