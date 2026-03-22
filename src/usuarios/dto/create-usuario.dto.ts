import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  password: string;

  @IsString({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  @IsIn(['admin', 'user'], { message: 'El rol debe ser admin o user' })
  rol?: string;
}