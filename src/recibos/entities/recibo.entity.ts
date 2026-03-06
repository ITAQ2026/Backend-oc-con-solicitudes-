import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('recibos')
export class Recibo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emisor: string;

  @Column()
  receptor: string;

  @Column({ type: 'text' })
  concepto: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ default: 'Efectivo' })
  condicion_pago: string;

  @CreateDateColumn()
  fecha: Date;
}