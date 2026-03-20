import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() creds: LoginDto) {
    return this.service.login(creds.email, creds.password);
  }

  @Post('registro')
  async registrar(@Body() datos: CreateUsuarioDto, @Query('adminId') adminId: string) {
    return this.service.crear(datos, +adminId || 1);
  }

  @Get()
  async listar() {
    return this.service.obtenerTodos();
  }

  @Patch(':id')
  async editar(@Param('id') id: string, @Body() datos: UpdateUsuarioDto, @Query('adminId') adminId: string) {
    return this.service.actualizar(+id, datos, +adminId || 1);
  }

  @Delete(':id')
  async borrar(@Param('id') id: string, @Query('adminId') adminId: string) {
    return this.service.eliminar(+id, +adminId || 1);
  }
}