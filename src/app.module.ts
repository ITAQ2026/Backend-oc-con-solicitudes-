import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProveedoresModule } from './proveedores/proveedores.module';
import { OrdenesCompraModule } from './ordenes-compra/ordenes-compra.module';
import { OrdenesPagoModule } from './ordenes-pago/ordenes-pago.module';
import { ComprasEspecialesModule } from './compras-especiales/compras-especiales.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

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
          
          autoLoadEntities: true,
          synchronize: false, 
          
          // IMPORTANTE: Render DB interna NO suele necesitar SSL, 
          // pero si usas la URL externa o Neon, se mantiene esta lógica.
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
  ],
})
export class AppModule {}