import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdenesCompraRepository } from './ordenes-compra.repository';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(private readonly ordenRepo: OrdenesCompraRepository) {}

  async crear(datos: CreateOrdenDto) {
    try {
      // 1. Convertimos el Array del DTO a String para la DB
      const itemsString = JSON.stringify(datos.items);

      // 2. Extraemos 'items' de 'datos' para que no choque al hacer el spread (...resto)
      const { items, ...resto } = datos;

      // 3. Usamos 'as any' para silenciar el error de validación de tipos de TS
      // Esto es seguro porque acabamos de procesar 'itemsString' manualmente
      const nuevaOrden = this.ordenRepo.create({
        ...resto,
        items: itemsString,
        fecha: new Date(),
      } as any); 

      return await this.ordenRepo.save(nuevaOrden);
    } catch (error) {
      throw new BadRequestException("Error al generar la Orden: " + error.message);
    }
  }

  async findAll() {
    return await this.ordenRepo.obtenerHistorial();
  }
}