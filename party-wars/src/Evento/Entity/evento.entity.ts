import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Usuario } from "../../Usuario/Entity/usuario.entity";

@Entity()
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombreSala: string;

  @Column()
  edadMinEvento: number;

  @Column()
  edadMaxEvento: number;

  @Column({ length: 255 })
  localizacion: string;

  @Column({ length: 255 })
  tematicaEvento: string;

  @Column({ length: 255 })
  descripcionEnvento: string;

  @Column({ length: 255 })
  localizacionEvento: string;

  @Column()
  cantidadAsistentes: number;

  @Column()
  fechaEvento: Date;

  @Column({ length: 255 })
  nombreEmpEvento: string;

  @Column({ length: 255, nullable: true })
  linksDeReferencia: string;  // Campo modificado para permitir valores nulos

  @Column({ type: 'float', nullable: true }) // Agregamos el campo precioEntrada con posibilidad de valores nulos
  precioEntrada: number | null;

  @Column({ length: 512, nullable: true })
  imagen: string;

  @ManyToMany(() => Usuario)
  @JoinTable({
    name: "usuario_evento",
    joinColumns: [{ name: "evento_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "usuario_id", referencedColumnName: "id" }],
  })
  usuarios: Usuario[];
}
