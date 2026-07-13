import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturasRepository } from './facturas.repository';

const DELETE_AUTHORIZED_EMAIL = 'admin@sistema.com';

@Injectable()
export class FacturasService {
  constructor(
    private readonly repo: FacturasRepository,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async crear(datos: CreateFacturaDto) {
    try {
      const nueva = this.repo.create({
        ...datos,
        fecha: new Date(datos.fecha),
      });
      return await this.repo.save(nueva);
    } catch (error) {
      throw new BadRequestException(
        'Error al registrar factura: ' + error.message,
      );
    }
  }

  async findAll() {
    return await this.repo.find({ order: { fecha: 'DESC', id: 'DESC' } });
  }

  async eliminar(id: number, adminId: number) {
    const usuario = await this.usuariosRepo.findOne({ where: { id: adminId } });
    if (
      (usuario?.email || '').toLowerCase().trim() !== DELETE_AUTHORIZED_EMAIL
    ) {
      throw new ForbiddenException(
        'Solo admin@sistema.com puede borrar facturas.',
      );
    }

    const factura = await this.repo.findOne({ where: { id } });
    if (!factura) {
      throw new NotFoundException('Factura no encontrada.');
    }

    await this.repo.delete(id);
    return { ok: true };
  }
}
