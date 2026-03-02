import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';

@Entity('ordenes_compra_items')
export class OrdenCompraItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  producto: string;

  @Column({ type: 'float' })
  cantidad: number;

  @Column({ type: 'float', default: 0 })
  precio: number;

  @ManyToOne(() => OrdenCompra, (orden) => orden.items, { onDelete: 'CASCADE' })
  orden: OrdenCompra;;
}