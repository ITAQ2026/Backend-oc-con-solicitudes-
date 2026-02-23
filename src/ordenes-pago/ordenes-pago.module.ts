import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesPagoController } from './ordenes-pago.controller';
import { OrdenesPagoService } from './ordenes-pago.service';
import { OrdenPago } from './entities/orden-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenPago])],
  controllers: [OrdenesPagoController], // ¡Importado arriba!
  providers: [OrdenesPagoService],      // ¡Importado arriba!
})
export class OrdenesPagoModule {}