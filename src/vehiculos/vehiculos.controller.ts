import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Post()
  async crear(@Body() datos: CreateVehiculoDto, @Query('adminId') adminId: string) {
    return this.service.crear(datos, +adminId || 1);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  // Actualización general (datos del vehículo)
  @Patch(':id')
  async editar(@Param('id') id: string, @Body() datos: UpdateVehiculoDto, @Query('adminId') adminId: string) {
    return this.service.actualizar(+id, datos, +adminId || 1);
  }

  // NUEVO: Ruta específica para cambiar el estado (Disponible, Ocupado, etc.)
  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number, 
    @Body('estado') estado: string, 
    @Query('adminId') adminId: string
  ) {
    return this.service.actualizarEstado(id, estado, +adminId || 1);
  }

  @Delete(':id')
  async borrar(@Param('id') id: string) {
    return this.service.eliminar(+id);
  }
}