import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('ordenes_pago')
export class OrdenPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proveedorNombre: string;

  @Column({ nullable: true })
  productoServicio: string; // <-- Agregar esto

  @Column('float', { default: 0 })
  monto: number;

  @Column('int', { default: 1 })
  cantidad: number; // <-- Agregar esto

  @Column('float', { default: 0 })
  precioUnitario: number; // <-- Agregar esto

  @Column({ nullable: true })
  caja: string; // <-- Agregar esto

  @Column({ default: 'Transferencia' })
  metodoPago: string;

  @Column({ nullable: true })
  referencia: string;

  @CreateDateColumn()
  fecha: Date;
}