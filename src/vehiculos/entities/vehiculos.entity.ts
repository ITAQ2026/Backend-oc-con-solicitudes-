import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrdenTrabajo } from '../../ordenes-trabajo/entities/orden-trabajo.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  patente: string;

  @Column()
  modelo: string;

  @Column({ type: 'int', nullable: true })
  anio: number;

  @Column({ type: 'date', nullable: true })
  vencimiento_vtv: string;

  @Column({ default: 'Activo' })
  estado: string;

  // Agregamos esta línea para cerrar el círculo de la relación
  @OneToMany(() => OrdenTrabajo, (ot) => ot.vehiculo)
  ordenes: OrdenTrabajo[];
}