import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  // Crear un nuevo usuario (útil para el registro inicial)
  async crear(datos: Partial<Usuario>) {
    if (datos.password) {
      const salt = await bcrypt.genSalt(10);
      datos.password = await bcrypt.hash(datos.password, salt);
    }
    const nuevoUsuario = this.usuariosRepository.create(datos);
    return await this.usuariosRepository.save(nuevoUsuario);
  }

  // Obtener todos los usuarios
  async obtenerTodos() {
    return await this.usuariosRepository.find({
      select: ['id', 'nombre', 'email', 'rol'], // No devolvemos el password por seguridad
    });
  }

  // MÉTODO DE LOGIN (El que estamos depurando)
  async login(email: string, pass: string) {
    console.log(`[AUTH] Intento de login para: ${email}`);

    // 1. Buscamos al usuario por email
    const usuario = await this.usuariosRepository.findOne({ where: { email } });

    // Si el usuario no existe
    if (!usuario) {
      console.error(`[AUTH] Error: Usuario ${email} no encontrado en la DB.`);
      throw new UnauthorizedException('El correo electrónico no está registrado');
    }

    // 2. Comparamos la contraseña enviada con el hash de la DB
    try {
      const esValida = await bcrypt.compare(pass, usuario.password);
      
      if (!esValida) {
        console.error(`[AUTH] Error: Contraseña incorrecta para ${email}`);
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      console.log(`[AUTH] Login exitoso para: ${email}`);

      // 3. Devolvemos el usuario sin la contraseña
      const { password, ...resultado } = usuario;
      return resultado;

    } catch (error) {
      console.error('[AUTH] Error interno al comparar contraseñas:', error);
      throw new UnauthorizedException('Error en el proceso de autenticación');
    }
  }

  // Buscar un usuario por ID
  async buscarPorId(id: number) {
    const usuario = await this.usuariosRepository.findOne({ 
        where: { id },
        select: ['id', 'nombre', 'email', 'rol'] 
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }
}