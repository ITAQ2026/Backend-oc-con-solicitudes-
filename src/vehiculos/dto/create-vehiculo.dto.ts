import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateVehiculoDto {
  @IsString()
  @IsNotEmpty({ message: 'La patente es obligatoria' })
  patente: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsNumber()
  @IsOptional()
  anio?: number;

  @IsNumber()
  @IsOptional()
  kilometraje_actual?: number;

  @IsString()
  @IsOptional()
  @IsIn(['Disponible', 'En Uso', 'En Taller', 'Baja'])
  estado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}