import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Forzamos a que devuelva 200 si todo va bien
  async login(@Body() body: any) {
    // Agregamos una validación extra aquí mismo
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Faltan datos en la petición');
    }
    
    return this.usuariosService.login(body.email, body.password);
  }
}