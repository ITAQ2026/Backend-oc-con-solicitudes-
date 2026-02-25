import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity('ordenes_compra_items')
export class OrdenCompraItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  producto: string;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precio: number;

  @ManyToOne(() => OrdenCompra, (orden) => orden.items)
  orden: OrdenCompra;

  @Column({ nullable: true })
  solicitudId: number; 

  @OneToOne(() => Solicitud)
  @JoinColumn()
  solicitud: Solicitud;
}