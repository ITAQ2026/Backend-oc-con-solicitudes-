import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComprasEspecialesService } from './compras-especiales.service';

@Controller('ordenes-especiales')
export class ComprasEspecialesController {
  constructor(private readonly service: ComprasEspecialesService) {}

  @Post()
  crear(@Body() datos: any) {
    return this.service.crear(datos);
  }

  @Get()
  obtenerTodas() {
    return this.service.obtenerTodas();
  }
}