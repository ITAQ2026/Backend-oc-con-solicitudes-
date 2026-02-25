import { Controller, Post, Body, Get, Param, UnauthorizedException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // 1. LOGIN: El corazón de tu problema actual
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Debe proporcionar email y contraseña');
    }

    // Llamamos al service que ya tiene los console.log de depuración
    return this.usuariosService.login(email, password);
  }

  // 2. CREAR: Por si necesitas registrar usuarios desde la API
  @Post('registro')
  async registrar(@Body() datos: any) {
    return this.usuariosService.crear(datos);
  }

  // 3. LISTAR: Para ver todos los usuarios (útil para el admin)
  @Get()
  async obtenerTodos() {
    return this.usuariosService.obtenerTodos();
  }

  // 4. BUSCAR POR ID
  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }
}