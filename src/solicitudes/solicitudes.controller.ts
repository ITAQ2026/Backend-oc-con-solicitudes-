import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes') // <--- AGREGÁ 'api/' AQUÍ
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  async crear(@Body() datos: any) {
    const usuarioIdProvisorio = datos.usuario_id || 1; 
    return this.service.crear(datos, usuarioIdProvisorio);
  }

  // solicitudes.controller.ts
@Get()
async obtenerTodas(@Query() query: any) {
  const usuarioSimulado = {
    // Tomamos el rol de la query (?rol=admin)
    rol: query.rol || 'user', 
    // Tomamos el id de la query o usamos 0 si es admin para que no filtre
    id: parseInt(query.usuario_id) || 0 
  };
  
  return this.service.obtenerTodas(usuarioSimulado);
}

  @Patch(':id/estado')
  async actualizarEstado(
    @Param('id') id: string, 
    @Body('estado') estado: string
  ) {
    return this.service.actualizarEstado(+id, estado);
  }
}