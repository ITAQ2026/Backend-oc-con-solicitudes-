import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly service: ProveedoresService) {}

  @Post()
  async crear(@Body() datos: CreateProveedorDto, @Query('adminId') adminId: string) {
    return this.service.crear(datos, +adminId || 1);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Patch(':id')
  async editar(
    @Param('id') id: string, 
    @Body() datos: UpdateProveedorDto, 
    @Query('adminId') adminId: string
  ) {
    return this.service.actualizar(+id, datos, +adminId || 1);
  }

  @Delete(':id')
  async borrar(@Param('id') id: string) {
    return this.service.eliminar(+id);
  }
}