import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuariosRepository } from './usuarios.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), AuthModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosRepository],
  exports: [UsuariosService, UsuariosRepository],
})
export class UsuariosModule {}
