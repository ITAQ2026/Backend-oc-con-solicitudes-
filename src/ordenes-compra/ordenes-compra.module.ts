import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenesCompraController } from './ordenes-compra.controller';
import { OrdenCompra } from './entities/orden-compra.entity';
import { OrdenCompraItem } from './entities/orden-compra-item.entity';
import { OrdenesCompraRepository } from './ordenes-compra.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, OrdenCompraItem])
  ],
  controllers: [OrdenesCompraController],
  providers: [OrdenesCompraService, OrdenesCompraRepository],
  exports: [OrdenesCompraService]
})
export class OrdenesCompraModule {}