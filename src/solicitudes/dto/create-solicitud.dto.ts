import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty({ message: 'El área es obligatoria' })
  area: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del solicitante es obligatorio' })
  solicitante: string;

  @IsNotEmpty({ message: 'Los ítems no pueden estar vacíos' })
  items: any; // Aceptamos any para manejar objeto o string antes de la conversión

  @IsString()
  @IsOptional()
  justificacion?: string;

  @IsString()
  @IsOptional()
  @IsIn(['BAJA', 'MEDIA', 'ALTA', 'Conveniente'])
  urgencia?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Hasta 200.000', 'Hasta 1.000.000', 'Mas de 1.000.000'])
  monto_estimado?: string;

  @IsNumber()
  @IsOptional()
  usuario_id?: number;

  @IsString()
  @IsOptional()
  link_referencia?: string;
}