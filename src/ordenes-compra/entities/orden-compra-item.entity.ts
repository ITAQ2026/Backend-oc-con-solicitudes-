import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';

@Entity('ordenes_compra_items')
export class OrdenCompraItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  producto: string;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precio: number;

  // Relación con la cabecera de la orden
  @ManyToOne(() => OrdenCompra, (orden) => orden.items, { onDelete: 'CASCADE' })
  orden: OrdenCompra;
}