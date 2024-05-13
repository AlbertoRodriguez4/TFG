import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Sala } from "./../../Sala/Entity/sala.entity";
import { Evento } from "../../Evento/Entity/evento.entity";
import { Buffer } from 'buffer';

// Definir un tipo de enumeración para los planes permitidos
enum Plan {
  BASICO = 'Básico',
  PREMIUM = 'Premium',
  BUSINESS = 'Business'
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  // Utilizar el tipo de enumeración para limitar los valores permitidos
  @Column({
    type: 'enum',
    enum: Plan,
    default: Plan.BASICO
  })
  plan: string;

  @Column({ length: 255 })
  descripcionPersonal: string;

  @Column("bytea", { nullable: true })
  imagen: Buffer;

  @ManyToMany(() => Sala)
  salas: Sala[];

  @ManyToMany(() => Evento)
  eventos: Evento[];
}
