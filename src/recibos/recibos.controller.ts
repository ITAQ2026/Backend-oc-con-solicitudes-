import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { CreateReciboDto } from './dto/create-recibo.dto';

@Controller('recibos')
export class RecibosController {
  constructor(private readonly service: RecibosService) {}

  @Post()
  async crear(@Body() datos: CreateReciboDto, @Query('adminId') adminId: string) {
    return this.service.crear(datos, +adminId || 1);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Get('orden/:id')
  async listarPorOrden(@Param('id') id: string) {
    return this.service.findByOrden(+id);
  }
}