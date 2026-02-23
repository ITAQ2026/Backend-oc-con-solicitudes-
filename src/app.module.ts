import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tus módulos funcionales
import { ProveedoresModule } from './proveedores/proveedores.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
import { OrdenesPagoModule } from './ordenes-pago/ordenes-pago.module';

@Module({
  imports: [
    // Conexión a Base de Datos Local (Postgres en tu PC)
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL, // 👈 clave
  autoLoadEntities: true,
  synchronize: false,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
}),

    // Tus módulos funcionales
    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
  ],
})
export class AppModule {}