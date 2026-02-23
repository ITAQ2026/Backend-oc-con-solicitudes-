import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenPago } from './entities/orden-pago.entity';

@Injectable()
export class OrdenesPagoService {
  constructor(
    @InjectRepository(OrdenPago)
    private repo: Repository<OrdenPago>,
  ) {}

  async create(data: any) {
    const nueva = this.repo.create(data);
    return await this.repo.save(nueva);
  }

  async findAll() {
    return await this.repo.find({ order: { fecha: 'DESC' } });
  }
}