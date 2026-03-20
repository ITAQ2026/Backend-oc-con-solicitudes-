import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdenesPagoRepository } from './ordenes-pago.repository';
import { CreateOrdenPagoDto } from './dto/create-orden-pago.dto';

@Injectable()
export class OrdenesPagoService {
  constructor(private readonly repo: OrdenesPagoRepository) {}

  async crear(datos: CreateOrdenPagoDto, adminId: number) {
    try {
      const nueva = this.repo.create({
        ...datos,
        creado_por: adminId
      });
      return await this.repo.save(nueva);
    } catch (error) {
      throw new BadRequestException('Error al crear Orden de Pago: ' + error.message);
    }
  }

  async cambiarEstado(id: number, estado: string, adminId: number) {
    const op = await this.repo.findOneBy({ id });
    if (!op) throw new NotFoundException('Orden de Pago no encontrada');

    op.estado = estado;
    op.autorizado_por = adminId;
    return await this.repo.save(op);
  }

  async findAll() {
    return await this.repo.listarConDetalles();
  }
}