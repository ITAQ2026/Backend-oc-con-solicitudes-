import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecibosController } from './recibos.controller';
import { RecibosService } from './recibos.service';
import { Recibo } from './entities/recibo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recibo])],
  controllers: [RecibosController],
  providers: [RecibosService],
})
export class RecibosModule {}