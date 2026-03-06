import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesTrabajoController } from './ordenes-trabajo.controller';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo])],
  controllers: [OrdenesTrabajoController],
  providers: [OrdenesTrabajoService],
})
export class OrdenesTrabajoModule {}