import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

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
  especificaciones?: string;

  @IsString() @IsOptional()
  autoriza?: string;

  @IsString() @IsOptional()
  retira?: string;

  @IsOptional()
  solicitudId?: number | string;

  @IsArray() @IsNotEmpty()
  items: any[]; // Array de objetos que viene del Front
}