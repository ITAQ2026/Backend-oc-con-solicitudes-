import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importa el Pipe
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Las solicitudes pueden incluir una imagen de referencia en base64,
  // que supera fácilmente el límite default de 100kb del body-parser.
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.setGlobalPrefix('api');

  // 2. Configuración de Validación Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos extraños
      transform: true, // Convierte tipos automáticamente (ej: string a number)
    }),
  );

  // Habilitamos CORS solo para los orígenes conocidos del frontend.
  // CORS_ORIGINS: lista separada por comas (ej: https://mi-app.vercel.app,http://localhost:3000)
  const origenesPermitidos = (
    process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5000'
  )
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origenesPermitidos,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Render asigna el puerto automáticamente
  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor corriendo en el puerto: ${port}`);
}
bootstrap();
