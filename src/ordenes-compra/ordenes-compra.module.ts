import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenesCompraController } from './ordenes-compra.controller';

// 1. IMPORTA LA NUEVA ENTIDAD AQUÍ ARRIBA
import { OrdenCompra } from './entities/orden-compra.entity';
import { OrdenCompraItem } from './entities/orden-compra-item.entity'; 

@Module({
  
  imports: [
    TypeOrmModule.forFeature([
      OrdenCompra, 
      OrdenCompraItem
    ])
  ],
  controllers: [OrdenesCompraController],
  providers: [OrdenesCompraService],
})
export class OrdenesCompraModule {}