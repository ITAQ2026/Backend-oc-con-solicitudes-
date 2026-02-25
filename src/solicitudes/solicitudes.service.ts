// src/solicitudes/solicitudes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitud.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private repo: Repository<Solicitud>,
  ) {}

  async crear(datos: any, usuarioId: number) {
    const nueva = this.repo.create({
      ...datos,
      usuario_id: usuarioId
    });
    return await this.repo.save(nueva);
  }

 async obtenerTodas(usuario: { id: number, rol: string }) {
  if (usuario.rol === 'admin') {
    // El admin ve todas las solicitudes y quién las hizo
    return await this.repo.find({ 
      relations: ['usuario'], 
      order: { fecha_creacion: 'DESC' } 
    });
  }
  // El usuario común solo ve las suyas
  return await this.repo.find({ 
    where: { usuario_id: usuario.id }, 
    order: { fecha_creacion: 'DESC' } 
  });
}

  async actualizarEstado(id: number, estado: string) {
    return await this.repo.update(id, { estado });
  }
}