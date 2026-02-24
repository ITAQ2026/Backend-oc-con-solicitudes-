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
  // Si hay DATABASE_URL usa la URL, si no, usa localhost (para tu PC)
  url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/gestion_db',
  autoLoadEntities: true,
  synchronize: true,
  // Solo activa SSL si estamos en Render (donde existe la URL)
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
}),

    // Tus módulos funcionales
    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
  ],
})
export class AppModule {}