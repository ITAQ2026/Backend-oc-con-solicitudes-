import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProveedoresModule } from './proveedores/proveedores.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
import { OrdenesPagoModule } from './ordenes-pago/ordenes-pago.module';
import { ComprasEspecialesModule } from './compras-especiales/compras-especiales.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

// NUEVOS MÓDULOS DE LOGÍSTICA
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { OrdenesTrabajoModule } from './ordenes-trabajo/ordenes-trabajo.module';

// NUEVO MÓDULO DE ADMINISTRACIÓN
import { RecibosModule } from './recibos/recibos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // En Render, usa la variable 'DATABASE_URL'
        const dbUrl = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: dbUrl,
          // Si no hay URL, usa los datos de tu .env local
          host: dbUrl ? undefined : configService.get<string>('DB_HOST'),
          port: dbUrl ? undefined : configService.get<number>('DB_PORT'),
          username: dbUrl ? undefined : configService.get<string>('DB_USERNAME'),
          password: dbUrl ? undefined : configService.get<string>('DB_PASSWORD'),
          database: dbUrl ? undefined : configService.get<string>('DB_DATABASE'),
          
          autoLoadEntities: true, // Esto cargará Vehiculo, OrdenTrabajo y Recibo automáticamente
          synchronize: true, // Crea las tablas en la DB si no existen
          
          ssl: dbUrl && dbUrl.includes('render.com') 
               ? { rejectUnauthorized: false } 
               : false,
        };
      },
    }),

    ProveedoresModule,
    OrdenesCompraModule,
    OrdenesPagoModule,
    ComprasEspecialesModule,
    UsuariosModule,
    SolicitudesModule,
    
    // REGISTRO DE NUEVOS MÓDULOS
    VehiculosModule,
    OrdenesTrabajoModule,
    RecibosModule, // <--- Módulo de Recibos agregado
  ],
})
export class AppModule {}