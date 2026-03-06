import { Injectable, BadRequestException } from '@nestjs/common';
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
    try {
      // Si los items vienen como objeto, los convertimos a string para la DB
      const itemsString = typeof datos.items === 'object' 
        ? JSON.stringify(datos.items) 
        : datos.items;

      const nueva = this.repo.create({
        area: datos.area,
        solicitante: datos.solicitante,
        items: itemsString, // Guardamos la estructura dinámica
        justificacion: datos.justificacion,
        urgencia: datos.urgencia || 'Conveniente',
        link_referencia: datos.link_referencia,
        estado: 'En Revisión', // Estado inicial solicitado
        usuario_id: usuarioId,
        // fecha_creacion se genera sola por el decorador @CreateDateColumn
      });

      return await this.repo.save(nueva);
    } catch (error) {
      throw new BadRequestException("Error al crear la solicitud: " + error.message);
    }
  }

  async obtenerTodas(usuario: { id: number; rol: string }) {
    const opciones: any = {
      order: { fecha_creacion: 'DESC' },
    };

    // Si no es admin, filtramos por su propio ID
    if (usuario.rol !== 'admin') {
      opciones.where = { usuario_id: usuario.id };
    } else {
      opciones.relations = ['usuario'];
    }

    return await this.repo.find(opciones);
  }

  async actualizarEstado(id: number, estado: string) {
    // Validamos que el estado sea uno de los permitidos
    const estadosValidos = ['En Revisión', 'Aprobado', 'Rechazado'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException("Estado no válido");
    }
    return await this.repo.update(id, { estado });
  }
}