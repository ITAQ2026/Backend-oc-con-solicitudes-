import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly service: OrdenesCompraService) {}

  @Post()
  async crear(@Body() datos: CreateOrdenDto) {
    return this.service.crear(datos);
  }

  @Get()
  async obtenerTodas() {
    return this.service.findAll();
  }
}