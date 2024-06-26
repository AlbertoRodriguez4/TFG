// Juego.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Pregunta } from "./pregunta.entity";

@Entity()
export class Juego {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    nombre: string;

    @Column({ length: 255 })
    propiedadJuego: string;

    @Column({ length: 255 })
    descripcionJuego: string;

    @Column({ length: 255 })
    categoriaJuego: string;

    @Column({ length: 255 })
    normasJuego: string;

    @ManyToMany(() => Pregunta)
    @JoinTable()
    preguntas: Pregunta[];
}
