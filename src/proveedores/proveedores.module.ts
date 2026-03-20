import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { Proveedor } from './entities/proveedor.entity';
import { ProveedoresRepository } from './proveedores.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProveedoresController],
  providers: [ProveedoresService, ProveedoresRepository],
  exports: [ProveedoresService]
})
export class ProveedoresModule {}