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
        const adminInicial = this.usuarioRepo.create({
          nombre: 'Administrador Inicial',
          email: 'admin@sistema.com',
          password: hashedPassword,
          rol: 'admin',
          creado_por: 1 
        });
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
   * Validación de credenciales
   */
  async login(email: string, pass: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(pass, usuario.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    const { password, ...userWithoutPass } = usuario;
    return userWithoutPass;
  }

  /**
   * Crea un usuario nuevo o recupera uno borrado
   */
  async crear(datos: CreateUsuarioDto, adminId: number) {
    try {
      // Buscamos el email incluyendo registros borrados (soft-deleted)
      const existe = await this.usuarioRepo.findOne({
        where: { email: datos.email },
        withDeleted: true,
      });

      const hashedPassword = await bcrypt.hash(datos.password, 10);

      if (existe) {
        // Si el usuario existe y NO tiene fecha de borrado, es un duplicado real (Conflicto 409)
        if (!existe.fecha_borrado) {
          throw new ConflictException('El email ya está registrado y activo');
        }

        // Si existe pero estaba borrado (como el ID 2 de tu pgAdmin), lo actualizamos
        Object.assign(existe, {
          ...datos,
          password: hashedPassword,
          creado_por: adminId || 1,
          fecha_borrado: null // IMPORTANTE: Esto habilita al usuario nuevamente
        });

        // .recover() es el método oficial de TypeORM para deshacer el borrado lógico
        return await this.usuarioRepo.recover(existe);
      }

      // Si no existe, creación estándar
      const nuevo = this.usuarioRepo.create({
        ...datos,
        password: hashedPassword,
        creado_por: adminId || 1,
      });

      return await this.usuarioRepo.save(nuevo);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Error en creación:', error);
      throw new InternalServerErrorException('Error al procesar el registro en la base de datos');
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
    // Protección del administrador principal
    if (id === 1) {
      throw new ConflictException('No se puede eliminar al administrador principal del sistema');
    }

    // Registramos quién borra antes de aplicar el soft delete
    await this.usuarioRepo.update(id, { borrado_por: adminId } as any);
    return await this.usuarioRepo.softDelete(id);
  }
}