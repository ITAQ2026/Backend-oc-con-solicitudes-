import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ordenes_especiales')
export class CompraEspecial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  id_orden: string;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ type: 'text', nullable: true })
  referencia: string;

  @Column({ nullable: true })
  contacto: string;

  @Column({ nullable: true })
  cotizacion: string;

  @Column({ type: 'text', nullable: true })
  forma_pago: string;

  @Column({ type: 'text', nullable: true })
  metodos_pago: string;

  @Column({ type: 'text', nullable: true })
  lugar_entrega: string;

  @Column({ type: 'text', nullable: true })
  plazo_entrega: string;

  @Column({ type: 'text', nullable: true })
  datos_facturacion: string;

  @Column({ type: 'jsonb', nullable: true })
  items: any[];

  @Column({ default: 'LEANDRO FERNÁNDEZ' })
  solicito: string;

  @Column({ default: 'LUCRECIA CAPÓ LLORENTE' })
  autorizo: string;

  @CreateDateColumn()
  fecha: Date;
}