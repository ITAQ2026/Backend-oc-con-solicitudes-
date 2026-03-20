import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del proveedor es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional()
  cuit?: string;

  @IsEmail({}, { message: 'El formato del email es incorrecto' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}