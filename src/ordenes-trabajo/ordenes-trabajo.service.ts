import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';

@Injectable()
export class OrdenesTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly otRepository: Repository<OrdenTrabajo>,
  ) {}

  async findAll(): Promise<OrdenTrabajo[]> {
    return this.otRepository.find({
      relations: ['vehiculo'], // Cruza los datos para traer la patente
      order: { id: 'DESC' },
    });
  }

  async create(data: any): Promise<OrdenTrabajo> {
    const nuevaOT = this.otRepository.create({
      descripcion_falla: data.falla,
      tareas_realizadas: data.tareas,
      kilometraje: data.kilometraje,
      responsable: data.responsable,
      repuestos_utilizados: data.repuestos, // Se guarda como JSONB automáticamente
      vehiculo: { id: data.vehiculoId }    // Vinculamos al ID del vehículo
    });
    
    return this.otRepository.save(nuevaOT);
  }
}