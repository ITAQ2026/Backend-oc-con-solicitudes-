import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { Vehiculo } from './entities/vehiculos.entity';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get()
  findAll() {
    return this.vehiculosService.findAll();
  }

  @Post()
  create(@Body() vehiculoData: Partial<Vehiculo>) {
    return this.vehiculosService.create(vehiculoData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.remove(id);
  }
}