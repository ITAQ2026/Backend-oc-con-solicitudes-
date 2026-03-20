import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  rol?: string;
}