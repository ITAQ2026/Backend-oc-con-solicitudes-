import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  async login(@Body() credenciales: any) {
    return this.usuariosService.login(credenciales.email, credenciales.password);
  }

  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.usuariosService.crear(datos);
  }

  @Get()
  async verTodos() {
    return this.usuariosService.obtenerTodos();
  }
}