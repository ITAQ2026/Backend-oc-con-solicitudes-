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
    // 1. Manejo de los ítems: Si vienen como String (JSON) desde el front, los parseamos
    let itemsProcesados = [];
    if (data.items) {
      itemsProcesados = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    // 2. Quitamos 'items' del objeto data principal para no confundir al repo.create
    const { items, ...datosOrden } = data;

    // 3. Crear la instancia de la Orden con sus ítems relacionados
    // Al tener 'cascade: true' en la entidad OrdenCompra, esto guardará los ítems automáticamente
    const nuevaOrden = this.repo.create({
      ...datosOrden,
      items: itemsProcesados
    });

    return await this.repo.save(nuevaOrden);
  }

  async findAll() {
    // Esto ya lo tenías bien, es fundamental para que el historial vea los ítems
    return await this.repo.find({
      relations: ['items', 'solicitud'],
      order: { id: 'DESC' }  
    });
  }

  async findOne(id: number) {
    return await this.repo.findOne({
      where: { id },
      relations: ['items', 'solicitud']
    });
  }
}