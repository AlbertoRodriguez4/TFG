import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../Entity/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({ where: { id } });
  }

  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(usuarioData);
    const createdUsuario = await this.usuarioRepository.save(usuario);
    console.log('Datos del usuario creado:', createdUsuario); // Agregar console.log aquí
    return createdUsuario;
  }

  async update(
    id: number,
    usuarioData: Partial<Usuario>,
  ): Promise<Usuario | undefined> {
    const usuario = await this.findOne(id);
    if (!usuario) {
      return undefined;
    }
    Object.assign(usuario, usuarioData);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .andWhere('usuario.password = :password', { password })
      .andWhere('usuario.id IS NOT NULL') // Chequea si el id es un número
      .getOne();

    if (!usuario) {
      return null;
    } else {
      console.log('Usuario encontrado:', usuario.nome);
      return usuario;
    }
  }
  async updatePlan(id: number, plan: string): Promise<Usuario | undefined> {
    //url para updatear : http://192.168.1.90:3000/usuarios/6/plan
    /*{
  "plan": "Premium"
    }*/
    const usuario = await this.findOne(id);
    if (!usuario) {
      return undefined;
    }
    usuario.plan = plan;
    return await this.usuarioRepository.save(usuario);
  }
}
