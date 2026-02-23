import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdenesPagoService } from './ordenes-pago.service';

@Controller('ordenes-pago') // Ruta: http://localhost:3000/ordenes-pago
export class OrdenesPagoController {
  constructor(private readonly ordenesPagoService: OrdenesPagoService) {}

  @Post()
  create(@Body() body: any) {
    return this.ordenesPagoService.create(body);
  }

  @Get()
  findAll() {
    return this.ordenesPagoService.findAll();
  }
}