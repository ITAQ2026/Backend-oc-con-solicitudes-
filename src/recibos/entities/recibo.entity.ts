import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('recibos')
export class Recibo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  emisor: string; // Quien entrega el dinero/bien (ej: Alpha Química)

  @Column()
  receptor: string; // Quien recibe (ej: el proveedor o empleado)

  @Column({ type: 'text' })
  concepto: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ default: 'Efectivo' })
  metodo_pago: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;
}