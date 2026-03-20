import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateReciboDto {
  @IsString()
  @IsNotEmpty()
  numero_recibo: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_emision: string;

  @IsNumber()
  @IsNotEmpty()
  orden_id: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}