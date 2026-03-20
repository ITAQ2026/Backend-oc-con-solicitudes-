import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Solicitud } from '../../solicitudes/entities/solicitud.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column({ default: 'user' })
  rol: string;

  // Auditoría
  @Column({ nullable: true })
  creado_por: number;

  @Column({ nullable: true })
  actualizado_por: number;

  @Column({ nullable: true })
  borrado_por: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @DeleteDateColumn()
  fecha_borrado: Date;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario)
  solicitudes: Solicitud[];
}