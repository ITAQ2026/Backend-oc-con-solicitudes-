import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  NotFoundException, 
  OnModuleInit,
  InternalServerErrorException
} from '@nestjs/common';
import { UsuariosRepository } from './usuarios.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(private readonly usuarioRepo: UsuariosRepository) {}

  /**
   * Inicializa el administrador si la tabla está vacía
   */
  async onModuleInit() {
    try {
      const cantidad = await this.usuarioRepo.count();
      if (cantidad === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Usamos 'as any' para evitar errores de tipado en la inicialización
        const adminInicial = this.usuarioRepo.create({
          nombre: 'Administrador Inicial',
          email: 'admin@sistema.com',
          password: hashedPassword,
          rol: 'admin',
          creado_por: null 
        } as any);

        await this.usuarioRepo.save(adminInicial);
        console.log('------------------------------------------------');
        console.log('🚀 SISTEMA INICIALIZADO: admin@sistema.com / admin123');
        console.log('------------------------------------------------');
      }
    } catch (error) {
      console.error('⚠️ Error al inicializar admin:', error.message);
    }
  }

  /**
   * Validación de credenciales para el Login
   */
  async login(email: string, pass: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(pass, usuario.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    // Quitamos el password del objeto de respuesta
    const { password, ...userWithoutPass } = usuario;
    return userWithoutPass;
  }

  /**
   * CREAR O RECUPERAR USUARIO (SOLUCIÓN AL BORRADO Y RE-REGISTRO)
   */
  async crear(datos: CreateUsuarioDto, adminId: number) {
    try {
      // 1. Buscamos el email incluyendo registros borrados (withDeleted: true)
      // Forzamos el tipo 'as any' para manipular las propiedades libremente
      const existe = await this.usuarioRepo.findOne({
        where: { email: datos.email },
        withDeleted: true,
      }) as any;

      const hashedPassword = await bcrypt.hash(datos.password, 10);

      if (existe) {
        // Si el usuario existe y NO tiene fecha de borrado, es un conflicto real
        if (!existe.fecha_borrado) {
          throw new ConflictException('El email ya está registrado y activo');
        }

        // 🚩 SI ESTABA BORRADO: Lo "limpiamos" y actualizamos sus datos
        // Al asignar valores al objeto encontrado, el .save() hará un UPDATE en lugar de INSERT
        existe.fecha_borrado = null; 
        existe.borrado_por = null;
        existe.nombre = datos.nombre;
        existe.password = hashedPassword;
        existe.rol = datos.rol; // Aquí se le asigna el nuevo rol (ej: 'admin')
        existe.creado_por = adminId || 1;

        return await this.usuarioRepo.save(existe);
      }

      // 2. Si no existe en absoluto, creación estándar
      const nuevo = this.usuarioRepo.create({
        ...datos,
        password: hashedPassword,
        creado_por: adminId || 1,
      } as any);

      return await this.usuarioRepo.save(nuevo);

    } catch (error) {
      if (error instanceof ConflictException) throw error;
      
      // Manejo de error de base de datos (Unique Violation)
      if (error.code === '23505') {
        throw new ConflictException('Conflicto: El correo ya existe en la base de datos.');
      }
      
      console.error('Error en creación:', error);
      throw new InternalServerErrorException('Error al procesar el registro');
    }
  }

  /**
   * Actualización de datos de usuario
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
   * Listado de usuarios activos
   */
  async obtenerTodos() {
    return await this.usuarioRepo.find();
  }

  /**
   * Borrado lógico (Soft Delete)
   */
  async eliminar(id: number, adminId: number) {
    // Protección del admin principal
    if (id === 1) {
      throw new ConflictException('No se puede eliminar al administrador principal');
    }

    // Registramos quién borra y aplicamos soft delete
    await this.usuarioRepo.update(id, { borrado_por: adminId } as any);
    return await this.usuarioRepo.softDelete(id);
  }
}