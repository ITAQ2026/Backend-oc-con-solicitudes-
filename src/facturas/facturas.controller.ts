import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturasService } from './facturas.service';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Roles('admin')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly service: FacturasService) {}

  @Post()
  async crear(@Body() datos: CreateFacturaDto) {
    return this.service.crear(datos);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Delete(':id')
  async eliminar(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.eliminar(+id, user.id);
  }
}
