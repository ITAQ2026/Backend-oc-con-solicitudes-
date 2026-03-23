import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemOrdenDto {
  @IsString() @IsNotEmpty()
  producto: string;

  @IsNumber()
  cantidad: number;

  @IsNumber() @IsOptional()
  precio: number;

  @IsString()
  moneda: string;

  @IsString()
  iva: string;
}

export class CreateOrdenDto {
  @IsString() @IsNotEmpty()
  proveedorNombre: string;

  @IsString() @IsOptional()
  plazoPago?: string;

  @IsString() @IsOptional()
  formaPago?: string;

  @IsString() @IsOptional()
  direccionDescarga?: string;

  @IsString() @IsOptional()
  tiempoEstimado?: string;

  @IsString() @IsOptional()
  autoriza?: string;

  @IsOptional()
  @IsNumber()
  solicitudId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrdenDto)
  items: ItemOrdenDto[];
}