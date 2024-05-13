import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sala } from '../Entity/sala.entity';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  async findAll(): Promise<Sala[]> {
    return await this.salaRepository.find();
  }

  async findOne(id: number): Promise<Sala | undefined> {
    return await this.salaRepository.findOne({ where: { id } });
  }

  async create(salaData: Partial<Sala>): Promise<number> {
    try {
      const sala = this.salaRepository.create(salaData);
      const newSala = await this.salaRepository.save(sala);
      return newSala.id; // Devuelve el ID de la sala creada
    } catch (error) {
      // Manejo de errores si la creación de la sala falla
      console.error('Error al crear la sala:', error);
      throw error;
    }
  }

  async update(id: number, salaData: Partial<Sala>): Promise<Sala | undefined> {
    const sala = await this.findOne(id);
    if (!sala) {
      return undefined;
    }
    Object.assign(sala, salaData);
    return await this.salaRepository.save(sala);
  }

  async remove(id: number): Promise<void> {
    await this.salaRepository.delete(id);
  }
  async addJuegoToSala(salaId: number, juegoId: number): Promise<void> {
    console.log('ID de la sala recibido:', salaId);
    console.log('ID del juego recibido:', juegoId);
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['juegos'],
    });
    if (!sala) {
      // Manejar el caso en que no se encuentre la sala
      return;
    }

    sala.juegos.push({ id: juegoId } as any);
    await this.salaRepository.save(sala);
  }
  async removeJuegoFromSala(salaId: number, juegoId: number): Promise<void> {
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['juegos'],
    });
    if (!sala) {
      // Manejar el caso en que no se encuentre la sala
      return;
    }
    sala.juegos = sala.juegos.filter((juego) => juego.id !== juegoId);
    await this.salaRepository.save(sala);
  }

  async addUsuarioToSala(salaId: number, usuarioId: number): Promise<void> {
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['usuarios'],
    });
    if (!sala) {
      // Manejar el caso en que no se encuentre la sala
      return;
    }
    sala.usuarios.push({ id: usuarioId } as any);
    await this.salaRepository.save(sala);
  }

  async removeUsuarioFromSala(
    salaId: number,
    usuarioId: number,
  ): Promise<void> {
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['usuarios'],
    });
    if (!sala) {
      // Manejar el caso en que no se encuentre la sala
      return;
    }
    sala.usuarios = sala.usuarios.filter((usuario) => usuario.id !== usuarioId);
    await this.salaRepository.save(sala);
  }

  async findAllJuegosBySalaId(salaId: number): Promise<any[]> {
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['juegos'],
    });
    return sala ? sala.juegos : [];
  }

  async findAllUsuariosBySalaId(salaId: number): Promise<any[]> {
    const sala = await this.salaRepository.findOne({
      where: { id: salaId },
      relations: ['usuarios'],
    });
    return sala ? sala.usuarios : [];
  }
 
  async findAllInfoByUsuarioId(usuarioId: number): Promise<Sala[]> { //ver la info de las salas: http://192.168.1.90:3000/salas/usuarios/6/salas
    return await this.salaRepository.createQueryBuilder("sala")
      .innerJoinAndSelect("sala.usuarios", "usuario")
      .where("usuario.id = :usuarioId", { usuarioId })
      .getMany();
  }
}
