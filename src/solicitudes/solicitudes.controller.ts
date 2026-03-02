import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

@Controller('api/solicitudes') // <--- AGREGÁ 'api/' AQUÍ
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  async crear(@Body() datos: any) {
    const usuarioIdProvisorio = datos.usuario_id || 1; 
    return this.service.crear(datos, usuarioIdProvisorio);
  }

  @Get()
  async obtenerTodas(@Query() query: any) {
    const rol = query.rol || 'user';
    const usuario_id = parseInt(query.usuario_id) || 1;

    const usuarioSimulado = {
      rol: rol,
      id: usuario_id
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