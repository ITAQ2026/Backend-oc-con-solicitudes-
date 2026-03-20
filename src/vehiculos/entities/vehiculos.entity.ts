import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  patente: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column({ nullable: true })
  anio: number;

  @Column({ nullable: true })
  numero_chasis: string;

  @Column({ default: 'Disponible' }) // Disponible, En Uso, En Taller, Baja
  estado: string;

  @Column({ type: 'int', default: 0 })
  kilometraje_actual: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  // Auditoría
  @Column({ nullable: true })
  creado_por: number;

  @Column({ nullable: true })
  actualizado_por: number;

  @CreateDateColumn()
  fecha_alta: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @DeleteDateColumn()
  fecha_baja: Date;
}