// src/solicitudes/entities/solicitud.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('solicitudes_compra')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  area: string;

  @Column()
  solicitante: string;

  @Column('text')
  descripcion: string;

  @Column()
  cantidad: number;

  @Column('text')
  justificacion: string;

  @Column({ type: 'date' })
  fecha_limite: Date;

  @Column({ default: 'Conveniente' })
  urgencia: string;

  @Column({ default: 'Pendiente' })
  estado: string;

  @Column({ nullable: true })
  link_referencia: string;

  // Relación con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ nullable: true })
  usuario_id: number;

  @CreateDateColumn()
  fecha_creacion: Date;
}