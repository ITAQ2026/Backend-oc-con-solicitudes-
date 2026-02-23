import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Lee el puerto del .env o usa el 3000 por defecto
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Servidor corriendo en: http://localhost:${port}`);
}
bootstrap();