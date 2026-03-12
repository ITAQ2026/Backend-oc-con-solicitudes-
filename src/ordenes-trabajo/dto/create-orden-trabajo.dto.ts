import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray, IsObject } from 'class-validator';

export class CreateOrdenTrabajoDto {
  @IsNotEmpty({ message: 'La falla es obligatoria' })
  @IsString()
  falla: string;

  @IsOptional()
  @IsString()
  tareas?: string;

  @IsNotEmpty()
  @IsNumber()
  kilometraje: number;

  @IsNotEmpty()
  @IsString()
  responsable: string;

  @IsOptional()
  @IsArray() // O IsObject dependiendo de cómo envíes los repuestos
  repuestos?: any[];

  @IsNotEmpty({ message: 'El ID del vehículo es obligatorio' })
  @IsNumber()
  vehiculoId: number;
}