import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosRepository extends Repository<Usuario> {
  constructor(private dataSource: DataSource) {
    super(Usuario, dataSource.createEntityManager());
  }

  async buscarPorEmail(email: string) {
    return await this.findOne({ where: { email } });
  }

  /**
   * Igual que buscarPorEmail pero incluye el hash de password (excluido por defecto).
   * Solo debe usarse para validar credenciales de login.
   */
  async buscarPorEmailConPassword(email: string) {
    return await this.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        rol: true,
      },
    });
  }

  /**
   * Busca un email en la lista blanca (registro en tabla usuarios)
   * Incluye usuarios borrados para permitir reactivación
   */
  async estaEnListaBlanca(email: string) {
    return await this.findOne({
      where: { email },
      withDeleted: true,
    });
  }
}
