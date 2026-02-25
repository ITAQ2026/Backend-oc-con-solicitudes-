import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
async registrar(@Body() datos: any) {
  return this.usuariosService.crear(datos);
}

  @Get()
  async verTodos() {
    return this.usuariosService.obtenerTodos();
  }
}