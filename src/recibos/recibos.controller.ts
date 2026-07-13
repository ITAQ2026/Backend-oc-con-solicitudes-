import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RecibosService } from './recibos.service';
import { CreateReciboDto } from './dto/create-recibo.dto';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Roles('admin')
@Controller('recibos')
export class RecibosController {
  constructor(private readonly service: RecibosService) {}

  @Post()
  async crear(
    @Body() datos: CreateReciboDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.crear(datos, user.id);
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
