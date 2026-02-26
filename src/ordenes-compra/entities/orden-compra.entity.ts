import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompraItem } from './orden-compra-item.entity';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proveedor: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  // Relación con sus propios items
  @OneToMany(() => OrdenCompraItem, (item) => item.orden, { cascade: true })
  items: OrdenCompraItem[];

  // RELACIÓN CON SOLICITUD (Para elegirla desde el formulario)
  @ManyToOne(() => Solicitud, { nullable: true })
  @JoinColumn({ name: 'solicitudId' })
  solicitud: Solicitud;

  @Column({ nullable: true })
  solicitudId: number; 
}