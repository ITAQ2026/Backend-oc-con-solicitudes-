import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() creds: LoginDto) {
    return this.service.login(creds.email, creds.password);
  }

  @Public()
  @Post('validar-email')
  @HttpCode(HttpStatus.OK)
  async validarEmail(@Body('email') email: string) {
    const esValido = await this.service.validarEmailEnListaBlanca(email);
    if (!esValido) {
      return {
        valido: false,
        mensaje: 'Este email no está autorizado para registrarse',
      };
    }
    return { valido: true, mensaje: 'Email autorizado' };
  }

  @Roles('admin')
  @Post('registro')
  async registrar(
    @Body() datos: CreateUsuarioDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.crear(datos, user.id);
  }

  @Roles('admin')
  @Get()
  async listar() {
    return this.service.obtenerTodos();
  }

  @Roles('admin')
  @Patch(':id')
  async editar(
    @Param('id') id: string,
    @Body() datos: UpdateUsuarioDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.actualizar(+id, datos, user.id);
  }

  @Roles('admin')
  @Delete(':id')
  async borrar(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.service.eliminar(+id, user.id);
  }
}
