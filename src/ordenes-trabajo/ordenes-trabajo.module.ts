import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesTrabajoController } from './ordenes-trabajo.controller';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { OrdenesTrabajoRepository } from './ordenes-trabajo.repository'; // 1. Asegúrate de importarlo

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo])],
  controllers: [OrdenesTrabajoController],
  providers: [
    OrdenesTrabajoService, 
    OrdenesTrabajoRepository // 2. Agregalo aquí para que Nest lo pueda inyectar
  ],
})
export class OrdenesTrabajoModule {}