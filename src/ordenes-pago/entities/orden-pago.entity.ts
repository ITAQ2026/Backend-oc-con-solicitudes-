import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ordenes_pago')
export class OrdenPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  numero_orden_pago: string;

  @Column()
  proveedorNombre: string; // <--- AGREGADO

  @Column()
  productoServicio: string; // <--- AGREGADO

  @Column()
  cantidad: number; // <--- AGREGADO

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precioUnitario: number; // <--- AGREGADO

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto_total: number;

  @Column({ default: 'Pendiente' })
  estado: string;

  @Column({ nullable: true })
  metodo_pago: string;

  @Column({ nullable: true })
  caja: string; // <--- AGREGADO

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ nullable: true })
  orden_compra_id: number;

  @Column()
  creado_por: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ nullable: true }) 
  autorizado_por: number;
}