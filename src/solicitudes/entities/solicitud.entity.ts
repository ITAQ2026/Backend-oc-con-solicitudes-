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

  // NUEVO: Aquí guardaremos el array de objetos [{producto, cantidad, precio}]
  @Column({ type: 'text', nullable: true })
  items: string;

  @Column('text', { nullable: true })
  justificacion: string;

  // Eliminamos fecha_limite manual y dejamos que se maneje por creación o urgencia
  @Column({ default: 'Conveniente' })
  urgencia: string;

  // CAMBIO: El estado por defecto ahora es 'En Revisión'
  @Column({ default: 'En Revisión' })
  estado: string;

  @Column({ nullable: true })
  link_referencia: string;

  // Relación con Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.solicitudes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ nullable: true })
  usuario_id: number;

  // Se genera sola, no necesitas pedirla en el formulario
  @CreateDateColumn()
  fecha_creacion: Date;
}