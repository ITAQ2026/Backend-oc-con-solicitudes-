import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Tus módulos funcionales existentes
import { ProveedoresModule } from './proveedores/proveedores.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
import { OrdenesPagoModule } from './ordenes-pago/ordenes-pago.module';
import { ComprasEspecialesModule } from './compras-especiales/compras-especiales.module';

// NUEVOS MÓDULOS: Agrégalos aquí
import { UsuariosModule } from './usuarios/usuarios.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [
    // Conexión a Base de Datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/gestion_db',
      autoLoadEntities: true,
      synchronize: true, // Esto creará 'usuarios' y 'solicitudes_compra' automáticamente
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),

    // Registro de módulos funcionales
    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
    ComprasEspecialesModule,
    
    // Agregamos los nuevos al final
    UsuariosModule,
    SolicitudesModule,
  ],
})
export class AppModule {}