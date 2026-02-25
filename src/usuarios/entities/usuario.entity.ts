import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @Column({ default: 'user' }) // 'admin' o 'user'
  rol: string;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario)
  solicitudes: Solicitud[];
}