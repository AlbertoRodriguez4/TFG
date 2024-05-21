import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../Entity/evento.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async findAll(): Promise<Evento[]> {
    return await this.eventoRepository.find();
  }

  async findOne(id: number): Promise<Evento | undefined> {
    return await this.eventoRepository.findOne({ where: { id } });
  }


  async create(evento: Evento): Promise<Evento> {
    console.log(evento);
    return await this.eventoRepository.save(evento);
  }

  async update(id: number, eventData: Partial<Evento>): Promise<Evento | undefined> {
    const evento = await this.findOne(id);
    if (!evento) {
      return undefined;
    }
    Object.assign(evento, eventData);
    return await this.eventoRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    await this.eventoRepository.delete(id);
  }
  async addUsuarioToEvento(eventoId: number, usuarioId: number): Promise<void> {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
      relations: ['usuarios'],
    });
    if (!evento) {
      // Manejar el caso en que no se encuentre la sala
      return;
    }
    evento.usuarios.push({ id: usuarioId } as any);
    await this.eventoRepository.save(evento);
  }
  async findAllUsuariosByEventoId(eventoId: number): Promise<any[]> {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
      relations: ['usuarios'],
    });
    return evento ? evento.usuarios : [];
  }
}
