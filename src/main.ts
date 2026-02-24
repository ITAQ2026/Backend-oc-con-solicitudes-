// main.ts (en la carpeta backend)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ESTA LÍNEA ES LA QUE SOLUCIONA EL ERROR EN ROJO
  app.enableCors(); 

  const port = process.env.PORT || 10000; // Render usa el 10000 por defecto
  await app.listen(port);
}
bootstrap();