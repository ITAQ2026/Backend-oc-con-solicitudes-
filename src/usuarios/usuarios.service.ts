import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}

  async crear(datos: any) {
    const nuevo = this.repo.create(datos);
    return await this.repo.save(nuevo);
  }

  async buscarPorEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async obtenerTodos() {
    return await this.repo.find();
  }
}