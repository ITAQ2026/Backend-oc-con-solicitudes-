import { Injectable, BadRequestException } from '@nestjs/common';
import { SolicitudesRepository } from './solicitudes.repository';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';

@Injectable()
export class SolicitudesService {
  constructor(
    private readonly solicitudRepo: SolicitudesRepository,
  ) {}

  async crear(datos: CreateSolicitudDto, usuarioId: number) {
  try {
    // 1. Convertimos a string (lo que la DB espera)
    const itemsString = typeof datos.items === 'object' 
      ? JSON.stringify(datos.items) 
      : String(datos.items);

    // 2. Extraemos para limpiar el objeto 'resto'
    const { items, usuario_id, ...resto } = datos;

    // 3. Creamos el objeto con un casting para que TS no se queje
    const nuevaSolicitud = this.solicitudRepo.create({
      ...resto,
      items: itemsString,    // Aquí ya es string
      usuario_id: usuarioId,
      estado: 'En Revisión',
    } as any); // <--- AGREGA 'as any' AQUÍ para forzar a TS a aceptar el objeto

    return await this.solicitudRepo.save(nuevaSolicitud);
  } catch (error) {
    throw new BadRequestException("Error al crear: " + error.message);
  }
}
  async obtenerTodas(usuario: { id: number; rol: string }) {
    return await this.solicitudRepo.buscarConFiltros(usuario);
  }

  async actualizarEstado(id: number, estado: string) {
    const estadosValidos = ['En Revisión', 'Aprobado', 'Rechazado'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException("Estado no válido");
    }
    return await this.solicitudRepo.update(id, { estado });
  }
}