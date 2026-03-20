import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesPagoService } from './ordenes-pago.service';
import { OrdenesPagoController } from './ordenes-pago.controller';
import { OrdenPago } from './entities/orden-pago.entity';
import { OrdenesPagoRepository } from './ordenes-pago.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenPago])],
  controllers: [OrdenesPagoController],
  providers: [OrdenesPagoService, OrdenesPagoRepository],
})
export class OrdenesPagoModule {}