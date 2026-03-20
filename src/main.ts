import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importa el Pipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.setGlobalPrefix('api');

  // 2. Configuración de Validación Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remueve campos que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían campos extraños
    transform: true,            // Convierte tipos automáticamente (ej: string a number)
  }));

  // Habilitamos CORS para que Vercel pueda conectarse
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Render asigna el puerto automáticamente
  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor corriendo en el puerto: ${port}`);
}
bootstrap();