import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Solicitud } from './entities/solicitud.entity';

@Injectable()
export class SolicitudesRepository extends Repository<Solicitud> {
  constructor(private dataSource: DataSource) {
    super(Solicitud, dataSource.createEntityManager());
  }

  async buscarConFiltros(usuario: { id: number; rol: string }) {
    const query = this.createQueryBuilder('solicitud')
      .leftJoinAndSelect('solicitud.usuario', 'usuario')
      .orderBy('solicitud.fecha_creacion', 'DESC');

    if (usuario.rol !== 'admin') {
      query.where('solicitud.usuario_id = :userid', { userid: usuario.id });
    }

    return await query.getMany();
  }
}