import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Sala } from "./../../Sala/Entity/sala.entity";
import { Evento } from "../../Evento/Entity/evento.entity";

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

  @Column({
    type: 'enum',
    enum: Plan,
    default: Plan.BASICO
  })
  plan: string;

  @Column({ length: 255 })
  descripcionPersonal: string;

  @Column({ length: 512, nullable: true })
  imagen: string; // Asegúrate de que la longitud sea suficiente

  @Column({length : 512, nullable: true})
  urlImagen: string;
  
  @ManyToMany(() => Sala)
  salas: Sala[];

  @ManyToMany(() => Evento)
  eventos: Evento[];
}
