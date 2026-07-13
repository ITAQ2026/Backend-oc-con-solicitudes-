import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrdenesPagoService } from './ordenes-pago.service';
import { CreateOrdenPagoDto } from './dto/create-orden-pago.dto';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Roles('admin')
@Controller('ordenes-pago')
export class OrdenesPagoController {
  constructor(private readonly service: OrdenesPagoService) {}

  @Post()
  async crear(
    @Body() datos: CreateOrdenPagoDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.crear(datos, user.id);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Patch(':id/estado')
  async actualizarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.cambiarEstado(+id, estado, user.id);
  }
}
