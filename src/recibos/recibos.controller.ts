import { Controller, Get, Post, Body } from '@nestjs/common';
import { RecibosService } from './recibos.service';

@Controller('recibos')
export class RecibosController {
  constructor(private readonly recibosService: RecibosService) {}

  @Get()
  obtenerTodos() {
    return this.recibosService.findAll();
  }

  @Post()
  crear(@Body() data: any) {
    return this.recibosService.create(data);
  }
}