import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Roles('admin')
@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly service: OrdenesCompraService) {}

  @Post()
  async crear(@Body() datos: CreateOrdenDto) {
    return this.service.crear(datos);
  }

  @Get()
  async obtenerTodas(@CurrentUser() user: AuthenticatedUser) {
    return this.service.findAll(user.id);
  }

  @Patch(':id/ocultar')
  async ocultar(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.ocultarParaAdmins(+id, user.id);
  }
}
