import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraEspecial } from './entities/compra-especial.entity';

@Injectable()
export class ComprasEspecialesService {
  constructor(
    @InjectRepository(CompraEspecial)
    private repo: Repository<CompraEspecial>,
  ) {}

  async crear(datos: any) {
    const nueva = this.repo.create(datos);
    return await this.repo.save(nueva);
  }

  async obtenerTodas() {
    return await this.repo.find({
      order: { fecha: 'DESC', id: 'DESC' }
    });
  }
}