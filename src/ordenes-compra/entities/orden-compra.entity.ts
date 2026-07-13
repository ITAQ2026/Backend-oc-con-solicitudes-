import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdenCompraItem } from './orden-compra-item.entity'; // Asegúrate de que este archivo exista
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proveedor: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ nullable: true })
  solicitudId?: number;

  @Column({ nullable: true })
  autoriza: string;

  @Column({ nullable: true })
  retira: string;

  @Column({ nullable: true })
  condicionPago: string;

  @Column({ nullable: true })
  plazoPago: string;

  @Column({ nullable: true })
  formaPago: string;

  @Column({ nullable: true })
  direccionDescarga: string;

  @Column({ nullable: true })
  tiempoEstimado: string;

  @Column({ nullable: true, type: 'text' })
  especificaciones: string;

  @Column({ nullable: true })
  creado_por_nombre: string;

  @Column({ nullable: true })
  creado_por_email: string;

  @Column({ default: false })
  oculto_para_admins: boolean;

  @Column({ nullable: true })
  ocultado_por_email: string;

  // Relación con los items (Esto quita el error en el create)
  @OneToMany(() => OrdenCompraItem, (item) => item.orden, { cascade: true })
  items: OrdenCompraItem[];

  @ManyToOne(() => Solicitud, { nullable: true })
  @JoinColumn({ name: 'solicitudId' })
  solicitud: Solicitud;
}
