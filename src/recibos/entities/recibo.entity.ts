import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from '../../ordenes-compra/entities/orden-compra.entity';

@Entity('recibos')
export class Recibo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero_recibo: string; // El número físico del comprobante

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Relación con la Orden de Compra
  @ManyToOne(() => OrdenCompra)
  @JoinColumn({ name: 'orden_id' })
  orden: OrdenCompra;

  @Column()
  orden_id: number;

  // Auditoría
  @Column()
  creado_por: number;

  @CreateDateColumn()
  fecha_registro: Date;
}