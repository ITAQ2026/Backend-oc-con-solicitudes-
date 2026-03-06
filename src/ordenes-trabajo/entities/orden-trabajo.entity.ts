import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Vehiculo } from '../../vehiculos/entities/vehiculos.entity';

@Entity('ordenes_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion_falla: string;

  @Column({ type: 'text', nullable: true })
  tareas_realizadas: string;

  // JSONB es ideal para guardar la lista de repuestos y cantidades
  @Column({ type: 'jsonb', nullable: true })
  repuestos_utilizados: any;

  @Column({ type: 'int', nullable: true })
  kilometraje: number;

  @Column({ nullable: true })
  responsable: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  // RELACIÓN: Muchas OTs pueden pertenecer a un solo Vehículo
  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.id, { 
    onDelete: 'CASCADE', // Si se borra el vehículo, se borran sus OTs
    eager: false         // No trae el vehículo a menos que lo pidamos con 'relations'
  })
  @JoinColumn({ name: 'vehiculoId' })
  vehiculo: Vehiculo;

  @Column()
  vehiculoId: number; // Columna explícita para facilitar la inserción
}