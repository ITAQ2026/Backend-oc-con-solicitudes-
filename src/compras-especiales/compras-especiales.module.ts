import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraEspecial } from './entities/compra-especial.entity';
import { ComprasEspecialesService } from './compras-especiales.service';
import { ComprasEspecialesController } from './compras-especiales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompraEspecial])],
  controllers: [ComprasEspecialesController],
  providers: [ComprasEspecialesService],
})
export class ComprasEspecialesModule {}