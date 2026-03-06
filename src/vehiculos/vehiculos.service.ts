import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculos.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  findAll(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find({ order: { patente: 'ASC' } });
  }

  // Corregido: Forzamos el tipo del ID para que coincida con la Entity
  async findOne(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOneBy({ id: id as any });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }

  async create(data: Partial<Vehiculo>): Promise<Vehiculo> {
    // Corregido: Usamos una constante para asegurar a TS que no es null/undefined
    const patenteOriginal = data.patente || '';
    const patenteProcesada = patenteOriginal.toUpperCase();

    const nuevo = this.vehiculoRepository.create({
      ...data,
      patente: patenteProcesada,
    });
    
    return this.vehiculoRepository.save(nuevo);
  }

  async remove(id: number): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.delete(id);
  }
}