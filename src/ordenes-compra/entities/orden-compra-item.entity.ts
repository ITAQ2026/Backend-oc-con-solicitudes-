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

  // Corregido: Agregamos el nombre de la propiedad 'precio'
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number;

  @Column({ default: 'PESOS' })
  moneda: string;

  @Column({ default: '21%' })
  iva: string;

  @ManyToOne(() => OrdenCompra, (orden) => orden.items, { onDelete: 'CASCADE' })
  orden: OrdenCompra; // Corregido: Quitamos el doble punto y coma
}
