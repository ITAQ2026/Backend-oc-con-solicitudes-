import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('recibos')
export class Recibo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero_recibo: string;

  @Column()
  emisor: string;

  @Column()
  receptor: string;

  @Column()
  concepto: string;

  @Column()
  condicion_pago: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_emision: Date;

  @Column({ nullable: true })
  orden_id: number;

  @Column()
  creado_por: number; // Este será el adminId

  @CreateDateColumn()
  fecha_registro: Date;
}