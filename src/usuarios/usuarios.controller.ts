import { Controller, Post, Body, Get, Param, UnauthorizedException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios') // ✅ AÑADIDO 'api/' para coincidir con el Frontend
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Debe proporcionar email y contraseña');
    }

    return this.usuariosService.login(email, password);
  }

  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.usuariosService.crear(datos);
  }

  @Get()
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }
}