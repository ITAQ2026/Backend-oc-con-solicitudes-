import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProveedoresRepository } from './proveedores.repository';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(private readonly repo: ProveedoresRepository) {}

  async crear(datos: CreateProveedorDto, adminId: number) {
    try {
      const nuevo = this.repo.create({
        ...datos,
        creado_por: adminId
      });
      return await this.repo.save(nuevo);
    } catch (error) {
      throw new BadRequestException('Error al crear proveedor: ' + error.message);
    }
  }

  async findAll() {
    return await this.repo.listarAlfabeticamente();
  }

  async actualizar(id: number, datos: UpdateProveedorDto, adminId: number) {
    const proveedor = await this.repo.findOneBy({ id });
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado');

    this.repo.merge(proveedor, datos);
    proveedor.actualizado_por = adminId;
    return await this.repo.save(proveedor);
  }

  async eliminar(id: number) {
    return await this.repo.delete(id);
  }
}