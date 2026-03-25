import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReciboDto {
  @IsString() @IsNotEmpty()
  numero_recibo: string;

  @IsString() @IsNotEmpty()
  emisor: string;

  @IsString() @IsNotEmpty()
  receptor: string;

  @IsString() @IsNotEmpty()
  concepto: string;

  @IsString() @IsNotEmpty()
  condicion_pago: string;

  @IsNumber() @IsNotEmpty()
  monto: number;

  @IsNumber() @IsOptional()
  orden_id?: number;
}