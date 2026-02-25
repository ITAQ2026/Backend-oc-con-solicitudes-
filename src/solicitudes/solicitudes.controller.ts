import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  async crear(@Body() datos: any) {
    // Temporalmente usamos un ID de usuario fijo hasta tener el Login listo
    const usuarioIdProvisorio = datos.usuario_id || 1; 
    return this.service.crear(datos, usuarioIdProvisorio);
  }

  @Get()
  async obtenerTodas(@Query('rol') rol: string, @Query('usuario_id') usuario_id: string) {
    // Simulamos el objeto usuario que vendría del Token
    const usuarioSimulado = {
      rol: rol || 'user',
      id: parseInt(usuario_id) || 1
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