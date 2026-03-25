import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReciboDto {
  @IsString()
  @IsNotEmpty()
  emisor: string;

  @IsString()
  @IsNotEmpty()
  receptor: string;

  @IsString()
  @IsNotEmpty()
  concepto: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  condicion_pago: string;

  @IsNumber()
  @IsOptional()
  orden_id?: number; 
}