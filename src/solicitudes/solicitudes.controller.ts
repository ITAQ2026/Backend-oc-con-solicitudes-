import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  async crear(@Body() datos: any, @CurrentUser() user: AuthenticatedUser) {
    // Al pasar 'datos' completo, el service ya recibirá 'monto_estimado'
    return this.service.crear(datos, user.id);
  }

  @Get()
  async obtenerTodas(
    @CurrentUser() user: AuthenticatedUser,
    @Query('estado') estado?: string,
  ) {
    return this.service.obtenerTodas({
      id: user.id,
      rol: user.rol,
      estado: estado || '',
    });
  }

  @Roles('admin')
  @Patch(':id/estado')
  async actualizarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    return this.service.actualizarEstado(+id, estado);
  }
}
