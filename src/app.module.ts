import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tus módulos funcionales
import { ProveedoresModule } from './proveedores/proveedores.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
import { OrdenesPagoModule } from './ordenes-pago/ordenes-pago.module';
// NUEVO: Importamos el módulo de Compras Especiales
import { ComprasEspecialesModule } from './compras-especiales/compras-especiales.module';

@Module({
  imports: [
    // Conexión a Base de Datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/gestion_db',
      autoLoadEntities: true,
      synchronize: true, // Esto creará la tabla 'ordenes_especiales' automáticamente al iniciar
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),

    // Tus módulos funcionales
    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
    // NUEVO: Registramos el módulo aquí
    ComprasEspecialesModule,
  ],
})
export class AppModule {}