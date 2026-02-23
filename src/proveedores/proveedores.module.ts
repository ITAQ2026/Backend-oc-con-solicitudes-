import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedoresController } from './proveedores.controller'; // <-- IMPORTAR
import { ProveedoresService } from './proveedores.service';       // <-- IMPORTAR
import { Proveedor } from './entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedoresController], // <-- ASEGÚRATE QUE ESTÉ AQUÍ
  providers: [ProveedoresService],       // <-- ASEGÚRATE QUE ESTÉ AQUÍ
})
export class ProveedoresModule {}