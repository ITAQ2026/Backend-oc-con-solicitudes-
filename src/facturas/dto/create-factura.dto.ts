import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFacturaDto {
  @IsOptional()
  @IsNumber()
  orden_compra_id?: number;

  @IsString()
  @IsNotEmpty()
  proveedor: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  solicitado_por?: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  numero_factura: string;

  @IsString()
  @IsNotEmpty()
  condicion_pago: string;

  @IsNumber()
  monto_total: number;

  @IsIn(['PESOS', 'USD'])
  moneda: string;

  @IsIn(['IVA', 'FINAL'])
  tipo_iva: string;
}
