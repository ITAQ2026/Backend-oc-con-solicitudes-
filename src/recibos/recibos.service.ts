import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recibo } from './entities/recibo.entity';

@Injectable()
export class RecibosService {
  constructor(
    @InjectRepository(Recibo)
    private readonly repository: Repository<Recibo>,
  ) {}

  findAll() {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  async create(data: Partial<Recibo>) {
    const nuevo = this.repository.create(data);
    return this.repository.save(nuevo);
  }
}