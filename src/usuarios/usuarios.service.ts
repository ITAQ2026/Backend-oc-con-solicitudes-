import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  NotFoundException, 
  OnModuleInit 
} from '@nestjs/common';
import { UsuariosRepository } from './usuarios.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(private readonly usuarioRepo: UsuariosRepository) {}

  /**
   * Método de ciclo de vida de NestJS. 
   * Se ejecuta automáticamente al arrancar el servidor.
   */
  async onModuleInit() {
    try {
      // Verificamos si la tabla está vacía
      const cantidad = await this.usuarioRepo.count();
      
      if (cantidad === 0) {
        // Encriptamos una contraseña inicial
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Creamos el objeto del primer administrador
        const adminInicial = this.usuarioRepo.create({
          nombre: 'Administrador Inicial',
          email: 'admin@sistema.com',
          password: hashedPassword,
          rol: 'admin',
          creado_por: 1 // ID de auditoría inicial (ficticio)
        });
        
        // Guardamos en la base de datos
        await this.usuarioRepo.save(adminInicial);
        
        console.log('------------------------------------------------');
        console.log('🚀 SISTEMA INICIALIZADO CORRECTAMENTE');
        console.log('👤 USUARIO: admin@sistema.com');
        console.log('🔑 PASSWORD: admin123');
        console.log('------------------------------------------------');
      }
    } catch (error) {
      console.error('⚠️ Error al inicializar el usuario admin:', error.message);
    }
  }

  /**
   * Valida las credenciales y retorna el usuario sin la contraseña
   */
  async login(email: string, pass: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(pass, usuario.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    // Extraemos el password del objeto para no enviarlo al frontend
    const { password, ...userWithoutPass } = usuario;
    return userWithoutPass;
  }

  /**
   * Crea un nuevo usuario validando que el email no exista
   */
  async crear(datos: CreateUsuarioDto, adminId: number) {
    const existe = await this.usuarioRepo.buscarPorEmail(datos.email);
    if (existe) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(datos.password, 10);
    const nuevo = this.usuarioRepo.create({
      ...datos,
      password: hashedPassword,
      creado_por: adminId,
    });
    return await this.usuarioRepo.save(nuevo);
  }

  /**
   * Actualiza datos de un usuario existente
   */
  async actualizar(id: number, datos: UpdateUsuarioDto, adminId: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id: id as any });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    }

    this.usuarioRepo.merge(usuario, datos);
    usuario.actualizado_por = adminId;
    return await this.usuarioRepo.save(usuario);
  }

  /**
   * Retorna la lista de todos los usuarios
   */
  async obtenerTodos() {
    return await this.usuarioRepo.find();
  }

  /**
   * Realiza un borrado lógico (Soft Delete)
   */
  async eliminar(id: number, adminId: number) {
    // Registramos quién realizó la eliminación antes del borrado lógico
    await this.usuarioRepo.update(id, { borrado_por: adminId } as any);
    return await this.usuarioRepo.softDelete(id);
  }
}