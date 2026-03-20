import { Injectable, BadRequestException } from '@nestjs/common';
import { RecibosRepository } from './recibos.repository';
import { CreateReciboDto } from './dto/create-recibo.dto';

@Injectable()
export class RecibosService {
  constructor(private readonly repo: RecibosRepository) {}

  async crear(datos: CreateReciboDto, adminId: number) {
    try {
      const nuevo = this.repo.create({
        ...datos,
        creado_por: adminId
      });
      return await this.repo.save(nuevo);
    } catch (error) {
      throw new BadRequestException('Error al registrar recibo: ' + error.message);
    }
  }

  async findAll() {
    return await this.repo.find({ order: { id: 'DESC' } });
  }

  async findByOrden(ordenId: number) {
    return await this.repo.buscarPorOrden(ordenId);
  }
}