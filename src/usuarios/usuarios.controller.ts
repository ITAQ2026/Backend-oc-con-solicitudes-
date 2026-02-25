import { Controller, Post, Body, Get, Param, UnauthorizedException, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Debe proporcionar email y contraseña');
    }

    // --- BLOQUE DE REPARACIÓN TEMPORAL ---
    // Si intentas entrar con este email, el sistema borrará al usuario viejo
    // y creará uno nuevo con el hash perfecto generado por NestJS.
    if (email === 'admin@sistema.com') {
        console.log('[DEBUG] Reparando usuario administrador...');
        await this.usuariosService.crear({
            nombre: 'Administrador',
            email: 'admin@sistema.com',
            password: 'admin123', // El service lo hasheará automáticamente
            rol: 'admin'
        });
    }
    // -------------------------------------

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

  @Get(':id')
  async obtenerUno(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }
}