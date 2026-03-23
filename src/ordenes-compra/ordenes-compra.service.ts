import { Injectable, BadRequestException } from '@nestjs/common';
import { OrdenesCompraRepository } from './ordenes-compra.repository';
import { CreateOrdenDto } from './dto/create-orden.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(private readonly ordenRepo: OrdenesCompraRepository) {}

  async crear(datos: CreateOrdenDto) {
    try {
      // 1. Convertimos el Array del DTO a String para la DB (Postgres/MySQL)
      const itemsString = JSON.stringify(datos.items);

      // 2. CORRECCIÓN CLAVE: Extraemos 'proveedorNombre' y lo asignamos a 'proveedor'
      // También extraemos 'items' para que no choque con el string que creamos
      const { items, proveedorNombre, ...resto } = datos;

      const nuevaOrden = this.ordenRepo.create({
        ...resto,
        proveedor: proveedorNombre, // <--- MAPEADO PARA LA BASE DE DATOS
        items: itemsString,
        fecha: new Date(),
      } as any); 

      return await this.ordenRepo.save(nuevaOrden);
    } catch (error) {
      // Si el error es de la DB, lo capturamos con un mensaje claro
      throw new BadRequestException("Error al generar la Orden: " + error.message);
    }
  }

  async findAll() {
    return await this.ordenRepo.obtenerHistorial();
  }
}