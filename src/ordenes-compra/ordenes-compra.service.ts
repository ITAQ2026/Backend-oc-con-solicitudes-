import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './entities/orden-compra.entity';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private repo: Repository<OrdenCompra>,
  ) {}

  async create(data: any) {
    // Lógica de Macro: Generar número correlativo
    const ultima = await this.repo.find({ order: { id: 'DESC' }, take: 1 });
    const nuevoId = ultima.length > 0 ? ultima[0].id + 1 : 1;
    data.numeroOrden = `OC-${nuevoId.toString().padStart(4, '0')}`;
    
    const nueva = this.repo.create(data);
    return this.repo.save(nueva);
  }

  // Cambia tu findAll por este:
  async findAll() {
    return await this.repo.find({
      relations: ['items'],
      order: { id: 'DESC' }  
    });
  }
}