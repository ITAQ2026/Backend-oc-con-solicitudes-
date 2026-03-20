import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecibosService } from './recibos.service';
import { RecibosController } from './recibos.controller';
import { Recibo } from './entities/recibo.entity';
import { RecibosRepository } from './recibos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Recibo])],
  controllers: [RecibosController],
  providers: [RecibosService, RecibosRepository],
})
export class RecibosModule {}