import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculos.entity'; // Ajusta la ruta según tu proyecto
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepo: Repository<Vehiculo>,
  ) {}

  async crear(datos: CreateVehiculoDto, adminId: number) {
    const nuevo = this.vehiculoRepo.create({ ...datos, creado_por: adminId });
    return await this.vehiculoRepo.save(nuevo);
  }

  async findAll() {
    return await this.vehiculoRepo.find({ order: { id: 'ASC' } });
  }

  async actualizar(id: number, datos: UpdateVehiculoDto, adminId: number) {
    const vehiculo = await this.vehiculoRepo.findOneBy({ id });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    
    this.vehiculoRepo.merge(vehiculo, datos);
    vehiculo.actualizado_por = adminId;
    return await this.vehiculoRepo.save(vehiculo);
  }

  // Método para el cambio de estado rápido
  async actualizarEstado(id: number, estado: string, adminId: number) {
    const vehiculo = await this.vehiculoRepo.findOneBy({ id });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    
    vehiculo.estado = estado;
    vehiculo.actualizado_por = adminId;
    return await this.vehiculoRepo.save(vehiculo);
  }

  async eliminar(id: number) {
    const vehiculo = await this.vehiculoRepo.findOneBy({ id });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return await this.vehiculoRepo.remove(vehiculo);
  }
}