import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from './usuarios.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuarioRepo: UsuariosRepository) {}

  async login(email: string, pass: string) {
    const usuario = await this.usuarioRepo.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const match = await bcrypt.compare(pass, usuario.password);
    if (!match) throw new UnauthorizedException('Credenciales incorrectas');

    const { password, ...userWithoutPass } = usuario;
    return userWithoutPass;
  }

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

  async actualizar(id: number, datos: UpdateUsuarioDto, adminId: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
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
    await this.usuarioRepo.update(id, { borrado_por: adminId });
    return await this.usuarioRepo.softDelete(id);
  }
}