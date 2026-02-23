import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { OrdenCompraItem } from './orden-compra-item.entity';

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numeroOrden: string;

  @Column()
  proveedorNombre: string;

  @Column()
  condicionPago: string; // cuenta corriente, efectivo, etc.

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column()
  autoriza: string; // Obligatorio

  @Column()
  retira: string;   // Obligatorio

  @OneToMany(() => OrdenCompraItem, (item) => item.orden, { cascade: true })
  items: OrdenCompraItem[];

  @CreateDateColumn()
  fecha: Date;
}