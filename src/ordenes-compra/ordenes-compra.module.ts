import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenesCompraController } from './ordenes-compra.controller';
import { OrdenCompra } from './entities/orden-compra.entity';
import { OrdenCompraItem } from './entities/orden-compra-item.entity';
import { Solicitud } from '../solicitudes/entities/solicitud.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenCompra,
      OrdenCompraItem,
      Solicitud,
      Usuario,
    ]),
  ],
  controllers: [OrdenesCompraController],
  providers: [OrdenesCompraService],
})
export class OrdenesCompraModule {}
