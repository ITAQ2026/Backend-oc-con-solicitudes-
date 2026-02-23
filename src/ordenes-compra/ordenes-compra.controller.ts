import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';

@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly service: OrdenesCompraService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}