import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from '../../ordenes-compra/entities/orden-compra.entity';

@Entity('ordenes_pago')
export class OrdenPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero_orden_pago: string; // Ej: OP-0001

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto_total: number;

  @Column({ default: 'Pendiente' }) // Pendiente, Pagado, Anulado
  estado: string;

  @Column({ nullable: true })
  metodo_pago: string; // Transferencia, Cheque, Efectivo

  @Column({ type: 'text', nullable: true })
  notas: string;

  // Relación con la Orden de Compra (opcional si es un pago suelto)
  @ManyToOne(() => OrdenCompra)
  @JoinColumn({ name: 'orden_compra_id' })
  orden_compra: OrdenCompra;

  @Column({ nullable: true })
  orden_compra_id: number;

  // Auditoría
  @Column()
  creado_por: number;

  @Column({ nullable: true })
  autorizado_por: number;

  @CreateDateColumn()
  fecha_creacion: Date;
}