import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Juego } from '../Entity/juego.entity';
import { Pregunta } from '../Entity/pregunta.entity';

@Injectable()
export class JuegosService {
  constructor(
    @InjectRepository(Juego)
    private readonly juegosRepository: Repository<Juego>,
    @InjectRepository(Pregunta)
    private readonly preguntasRepository: Repository<Pregunta>,
  ) {}

  async findAll(): Promise<Juego[]> {
    console.log('Listando TODOS los juegos.');
    return this.juegosRepository.find();
  }

  async create(juego: Juego): Promise<Juego> {
    return this.juegosRepository.save(juego);
  }

  async delete(id: number): Promise<void> {
    await this.juegosRepository.delete(id);
  }
  async findAllPreguntas(): Promise<Pregunta[]> {
    console.log('Listando TODAS las preguntas.');
    return this.preguntasRepository.find();
  }
  async createPregunta(pregunta: Pregunta): Promise<Pregunta> {
    return this.preguntasRepository.save(pregunta);
  }

  async addPreguntaToJuego(juegoId: number, preguntaId: number): Promise<void> {
    //la url, hay que pasar los datos por la misma url: http://192.168.1.90:3000/juegos/9/preguntas/9
    const juego = await this.juegosRepository.findOne({
      where: { id: juegoId },
      relations: ['preguntas'],
    });
    if (!juego) {
      // Manejar el caso en que no se encuentre el juego
      return;
    }

    const pregunta = await this.preguntasRepository.findOne({
      where: { id: preguntaId },
    });
    if (!pregunta) {
      // Manejar el caso en que no se encuentre la pregunta
      return;
    }

    juego.preguntas.push(pregunta);
    await this.juegosRepository.save(juego);
  }

  async findPreguntasByJuegoId(juegoId: number): Promise<Pregunta[]> {
    //ver las preguntas de un juego: http://192.168.1.90:3000/juegos/9/preguntas
    const juego = await this.juegosRepository.findOne({
      where: { id: juegoId },
      relations: ['preguntas'],
    });
    if (!juego) {
      // Manejar el caso en que no se encuentre el juego
      return [];
    }
    return juego.preguntas;
  }
  async findByCategoria(categoria: string): Promise<Juego[]> {
    return this.juegosRepository.find({ where: { categoriaJuego: categoria } });
  }
}
