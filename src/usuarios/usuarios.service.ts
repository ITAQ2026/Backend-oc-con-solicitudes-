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
        console.log('🚀 SISTEMA INICIALIZADO: admin@sistema.com / admin123');
      }
    } catch (error) {
      console.error('⚠️ Error al inicializar admin:', error.message);
    }
  }

  async login(email: string, pass: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(pass, usuario.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    const { password, ...userWithoutPass } = usuario;
    return userWithoutPass;
  }

  /**
   * Crea un usuario o restaura uno eliminado previamente
   */
  async crear(datos: CreateUsuarioDto, adminId: number) {
    try {
      // Buscamos el email incluyendo los registros con borrado lógico
      const existe = await this.usuarioRepo.findOne({
        where: { email: datos.email },
        withDeleted: true,
      });

      const hashedPassword = await bcrypt.hash(datos.password, 10);

      if (existe) {
        // CORRECCIÓN AQUÍ: Usamos (existe as any) para evitar el error de TypeScript
        // O verificamos si existe en el objeto la propiedad deleted_at
        if (!(existe as any).deleted_at) {
          throw new ConflictException('El email ya está registrado y activo');
        }

        // Si el usuario existe pero está BORRADO, lo restauramos
        this.usuarioRepo.merge(existe, {
          ...datos,
          password: hashedPassword,
          creado_por: adminId || 1,
          deleted_at: null, // Restauramos el acceso
        } as any);

        return await this.usuarioRepo.save(existe);
      }

      // Si no existe, creamos uno nuevo normal
      const nuevo = this.usuarioRepo.create({
        ...datos,
        password: hashedPassword,
        creado_por: adminId || 1,
      });

      return await this.usuarioRepo.save(nuevo);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Error en creación de usuario:', error);
      throw new InternalServerErrorException('Error al procesar el registro en la base de datos');
    }
  }

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

  async obtenerTodos() {
    return await this.usuarioRepo.find();
  }

  async eliminar(id: number, adminId: number) {
    if (id === 1) throw new ConflictException('No se puede eliminar al administrador principal');
    
    // Registramos quién realizó la eliminación
    await this.usuarioRepo.update(id, { borrado_por: adminId } as any);
    return await this.usuarioRepo.softDelete(id);
  }
}