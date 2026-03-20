import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes') 
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  async crear(@Body() datos: any) {
    // Al pasar 'datos' completo, el service ya recibirá 'monto_estimado'
    const usuarioIdProvisorio = Number(datos.usuario_id) || 1; 
    return this.service.crear(datos, usuarioIdProvisorio);
  }

  @Get()
  async obtenerTodas(@Query() query: any) {
    const usuarioSimulado = {
      rol: query.rol || 'user', 
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