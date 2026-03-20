import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { OrdenesPagoService } from './ordenes-pago.service';
import { CreateOrdenPagoDto } from './dto/create-orden-pago.dto';

@Controller('ordenes-pago')
export class OrdenesPagoController {
  constructor(private readonly service: OrdenesPagoService) {}

  @Post()
  async crear(@Body() datos: CreateOrdenPagoDto, @Query('adminId') adminId: string) {
    return this.service.crear(datos, +adminId || 1);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Patch(':id/estado')
  async actualizarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @Query('adminId') adminId: string
  ) {
    return this.service.cambiarEstado(+id, estado, +adminId || 1);
  }
}