import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculosController } from './vehiculos.controller';
import { VehiculosService } from './vehiculos.service';
import { Vehiculo } from './entities/vehiculos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])], // Registra la entidad aquí
  controllers: [VehiculosController],
  providers: [VehiculosService],
  exports: [VehiculosService], // Lo exportamos para que OT pueda usarlo
})
export class VehiculosModule {}