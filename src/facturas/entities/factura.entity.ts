import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdenCompra } from '../../ordenes-compra/entities/orden-compra.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  orden_compra_id: number;

  @Column()
  proveedor: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  solicitado_por: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  numero_factura: string;

  @Column()
  condicion_pago: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  monto_total: number;

  @Column({ default: 'PESOS' })
  moneda: string;

  @Column({ default: 'FINAL' })
  tipo_iva: string;

  @CreateDateColumn()
  fecha_registro: Date;

  @ManyToOne(() => OrdenCompra, { nullable: true })
  @JoinColumn({ name: 'orden_compra_id' })
  orden_compra: OrdenCompra;
}
