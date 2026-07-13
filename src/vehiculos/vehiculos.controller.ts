import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Post()
  async crear(
    @Body() datos: CreateVehiculoDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.crear(datos, user.id);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  // Actualización general (datos del vehículo)
  @Patch(':id')
  async editar(
    @Param('id') id: string,
    @Body() datos: UpdateVehiculoDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.actualizar(+id, datos, user.id);
  }

  // NUEVO: Ruta específica para cambiar el estado (Disponible, Ocupado, etc.)
  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.actualizarEstado(id, estado, user.id);
  }

  @Delete(':id')
  async borrar(@Param('id') id: string) {
    return this.service.eliminar(+id);
  }
}
