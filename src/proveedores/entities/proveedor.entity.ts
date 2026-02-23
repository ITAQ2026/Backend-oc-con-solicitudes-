import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  cuit: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  localidad: string;

  @Column({ nullable: true })
  provincia: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true, name: 'codigo_postal' })
  codigoPostal: string;

}