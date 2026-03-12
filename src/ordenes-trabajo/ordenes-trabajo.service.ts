import { Injectable } from '@nestjs/common';
import { OrdenesTrabajoRepository } from './ordenes-trabajo.repository';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto'; // Importa el DTO

@Injectable()
export class OrdenesTrabajoService {
  constructor(
    private readonly otRepository: OrdenesTrabajoRepository,
  ) {}

  async findAll(): Promise<OrdenTrabajo[]> {
    return this.otRepository.getAll();
  }

  async create(dto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    // El mapeo ahora es mucho más seguro
    const payload = {
      descripcion_falla: dto.falla,
      tareas_realizadas: dto.tareas,
      kilometraje: dto.kilometraje,
      responsable: dto.responsable,
      repuestos_utilizados: dto.repuestos,
      vehiculo: { id: dto.vehiculoId }
    };
    
    return this.otRepository.saveOne(payload);
  }
}