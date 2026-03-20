import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitud } from './entities/solicitud.entity';
import { SolicitudesRepository } from './solicitudes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SolicitudesController],
  providers: [SolicitudesService, SolicitudesRepository], // Agregamos el Repo aquí
  exports: [SolicitudesService, TypeOrmModule]
})
export class SolicitudesModule {}