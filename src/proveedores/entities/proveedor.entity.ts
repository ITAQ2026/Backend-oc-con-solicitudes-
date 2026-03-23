import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true, nullable: true })
  cuit: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  // --- NUEVOS CAMPOS AGREGADOS ---
  @Column({ nullable: true })
  localidad: string;

  @Column({ nullable: true })
  provincia: string;

  @Column({ nullable: true, name: 'codigo_postal' }) // Usamos snake_case para la DB
  codigoPostal: string; 
  // -------------------------------

  // Auditoría
  @Column({ nullable: true })
  creado_por: number;

  @Column({ nullable: true })
  actualizado_por: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}