// compras-especiales/entities/compra-especial.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity('ordenes_especiales')
export class CompraEspecial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_orden', unique: true }) // Especificamos el nombre real de la tabla
  id_orden: string;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ type: 'text', nullable: true })
  referencia: string;

  @Column({ nullable: true })
  contacto: string;

  @Column({ nullable: true })
  cotizacion: string;

  @Column({ name: 'forma_pago', type: 'text', nullable: true })
  forma_pago: string;

  @Column({ name: 'metodos_pago', type: 'text', nullable: true })
  metodos_pago: string;

  @Column({ name: 'lugar_entrega', type: 'text', nullable: true })
  lugar_entrega: string;

  @Column({ name: 'plazo_entrega', type: 'text', nullable: true })
  plazo_entrega: string;

  @Column({ name: 'datos_facturacion', type: 'text', nullable: true })
  datos_facturacion: string;

  @Column({ type: 'jsonb', nullable: true })
  items: any;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ nullable: true })
  solicitudId: number; 

  @OneToOne(() => Solicitud)
  @JoinColumn()
  solicitud: Solicitud;
}