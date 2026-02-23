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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres', // Cambia esto por tu contraseña de pgAdmin
      database: 'gestion_db',        // Cambia esto por el nombre de tu BD local
      autoLoadEntities: true,
      //synchronize: true,             // Mantiene las tablas sincronizadas en local
      ssl: false,                    // En localhost no se usa SSL
    }),

    // Tus módulos funcionales
    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
  ],
})
export class AppModule {}