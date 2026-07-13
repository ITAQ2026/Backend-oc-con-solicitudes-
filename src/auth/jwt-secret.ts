import { ConfigService } from '@nestjs/config';

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error(
      'JWT_SECRET no esta configurado. Definilo en las variables de entorno antes de iniciar el servidor.',
    );
  }
  return secret;
}
