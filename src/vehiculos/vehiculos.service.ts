import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { VehiculosRepository } from './vehiculos.repository';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(private readonly repo: VehiculosRepository) {}

  async crear(datos: CreateVehiculoDto, adminId: number) {
    const existe = await this.repo.buscarPorPatente(datos.patente);
    if (existe) throw new ConflictException('La patente ya está registrada');

    const nuevo = this.repo.create({
      ...datos,
      patente: datos.patente.toUpperCase(),
      creado_por: adminId
    });
    return await this.repo.save(nuevo);
  }

  async findAll() {
    return await this.repo.find({ order: { patente: 'ASC' } });
  }

  async actualizar(id: number, datos: UpdateVehiculoDto, adminId: number) {
    const vehiculo = await this.repo.findOneBy({ id });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    this.repo.merge(vehiculo, datos);
    vehiculo.actualizado_por = adminId;
    return await this.repo.save(vehiculo);
  }

  async eliminar(id: number) {
    return await this.repo.softDelete(id);
  }
}