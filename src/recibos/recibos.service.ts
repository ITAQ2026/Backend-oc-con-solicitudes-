import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recibo } from './entities/recibo.entity';

@Injectable()
export class RecibosService {
  constructor(
    @InjectRepository(Recibo)
    private readonly reciboRepository: Repository<Recibo>,
  ) {}

  findAll(): Promise<Recibo[]> {
    return this.reciboRepository.find({ order: { fecha: 'DESC' } });
  }

  create(data: Partial<Recibo>): Promise<Recibo> {
    const nuevo = this.reciboRepository.create(data);
    return this.reciboRepository.save(nuevo);
  }
}