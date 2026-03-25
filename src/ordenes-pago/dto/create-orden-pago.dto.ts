import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrdenPagoDto {
  @IsString() @IsNotEmpty()
  numero_orden_pago: string;

  @IsString() @IsNotEmpty()
  proveedorNombre: string;

  @IsString() @IsNotEmpty()
  productoServicio: string;

  @IsNumber() @IsNotEmpty()
  cantidad: number;

  @IsNumber() @IsNotEmpty()
  precioUnitario: number;

  @IsNumber() @IsNotEmpty()
  monto_total: number;

  @IsString() @IsOptional()
  metodo_pago?: string;

  @IsString() @IsOptional()
  caja?: string;

  @IsString() @IsOptional()
  notas?: string;

  @IsNumber() @IsOptional()
  orden_compra_id?: number;
}