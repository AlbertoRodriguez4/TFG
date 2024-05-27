// Sala.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Juego } from "../../Juego/Entity/juego.entity";
import { Usuario } from "./../../Usuario/Entity/usuario.entity";

@Entity()
export class Sala {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255 })
  descripcion: string;

  @Column({ length: 255 })
  tematicaSala: string;

  @Column()
  edadMinima: number;

  @Column()
  edadMaxima: number;

  @Column({ length: 255 })
  localizacionSala: string;

  @Column()
  numeroParticipantes: string;

  @Column({ type: 'timestamp', nullable: true }) // Cambiado a 'datetime' para incluir hora
  fecha: Date | null; // 'Date | null' para permitir valores nulos

  @ManyToMany(() => Juego)
  @JoinTable({
    name: "sala_juego",
    joinColumns: [{ name: "sala_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "juego_id", referencedColumnName: "id" }],
  })
  juegos: Juego[];

  @ManyToMany(() => Usuario)
  @JoinTable({
    name: "usuario_sala",
    joinColumns: [{ name: "sala_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "usuario_id", referencedColumnName: "id" }],
  })
  usuarios: Usuario[];
}
