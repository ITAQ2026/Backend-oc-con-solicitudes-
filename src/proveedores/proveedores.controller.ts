import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Roles('admin')
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly service: ProveedoresService) {}

  @Post()
  async crear(
    @Body() datos: CreateProveedorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.crear(datos, user.id);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Patch(':id')
  async editar(
    @Param('id') id: string,
    @Body() datos: UpdateProveedorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.actualizar(+id, datos, user.id);
  }

  @Delete(':id')
  async borrar(@Param('id') id: string) {
    return this.service.eliminar(+id);
  }
}
