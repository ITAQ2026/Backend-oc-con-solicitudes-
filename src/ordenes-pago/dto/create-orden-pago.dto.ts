import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateOrdenPagoDto {
  @IsString()
  @IsNotEmpty()
  numero_orden_pago: string;

  @IsNumber()
  @IsNotEmpty()
  monto_total: number;

  @IsString()
  @IsOptional()
  @IsIn(['Transferencia', 'Cheque', 'Efectivo', 'Otro'])
  metodo_pago?: string;

  @IsNumber()
  @IsOptional()
  orden_compra_id?: number;

  @IsString()
  @IsOptional()
  notas?: string;
}