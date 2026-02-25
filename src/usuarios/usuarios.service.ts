import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <--- IMPORTANTE
import { Repository } from 'typeorm';                // <--- IMPORTANTE
import { Usuario } from './entities/usuario.entity'; // Agregamos /entities/
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>, // <--- Esto debe coincidir
  ) {}

  // Método para crear (ajusta según tus campos)
  async crear(datos: any) {
    const nuevoUsuario = this.usuariosRepository.create(datos);
    return await this.usuariosRepository.save(nuevoUsuario);
  }

  async obtenerTodos() {
    return await this.usuariosRepository.find();
  }

  async login(email: string, pass: string) {
    // Buscamos al usuario
    const usuario = await this.usuariosRepository.findOne({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparamos la contraseña
    const esValida = await bcrypt.compare(pass, usuario.password);

    if (!esValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Quitamos el password de la respuesta por seguridad
    const { password, ...resultado } = usuario;
    return resultado;
  }
}