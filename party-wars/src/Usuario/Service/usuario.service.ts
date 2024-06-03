import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../Entity/usuario.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private verificationCodes: { [email: string]: string } = {};

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({ where: { id } });
  }

  async create(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(usuarioData);
    const createdUsuario = await this.usuarioRepository.save(usuario);
    console.log('Datos del usuario creado:', createdUsuario); // Verifica que los datos se guarden correctamente
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
      .andWhere('usuario.id IS NOT NULL')
      .getOne();

    if (!usuario) {
      return null;
    } else {
      console.log('Usuario encontrado:', usuario.nome);
      return usuario;
    }
  }

  async updatePlan(id: number, plan: string): Promise<Usuario | undefined> {
    const usuario = await this.findOne(id);
    if (!usuario) {
      return undefined;
    }
    usuario.plan = plan;
    return await this.usuarioRepository.save(usuario);
  }

  generateRandomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async sendRandomCodeByEmail(email: string): Promise<string> {
    const randomCode = this.generateRandomCode();
    this.verificationCodes[email] = randomCode; // Almacenar el código en memoria
    console.log('Almacenado en verificationCodes:', this.verificationCodes);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'partywarsoficial@gmail.com',
        pass: 'xsmj uixl dfvz lgwk',
      },
    });

    const mailOptions = {
      from: 'partywarsoficial@gmail.com',
      to: email,
      subject: '¡Bienvenido a Party Wars! Aquí está tu Código Verificación',
      html: `
        <h1>¡Bienvenido a Party Wars!</h1>
        <p>Gracias por unirte a nuestra familia. Estamos emocionados de que formes parte de Party Wars, donde cada fiesta es una batalla para recordar.</p>
        <p>Para comenzar, aquí tienes tu código de verificación:</p>
        <p style="font-size: 2em; font-weight: bold; color: #FF5733;">${randomCode}</p>
        <p>Usa este código para activar tu cuenta y descubrir todas las sorpresas que tenemos preparadas para ti.</p>
        <p>¡Prepárate para la revolución de las fiestas!</p>
        <p>Saludos,<br>El equipo de Party Wars</p>
      `,
    };
    console.log(`Código de verificación generado para ${email}: ${randomCode}`);
    await transporter.sendMail(mailOptions);

    return randomCode;
  }

  verifyCode(email: string, code: string): boolean {
    console.log(`Verificando código para ${email}: almacenado - ${this.verificationCodes[email]}, recibido - ${code}`);
    return this.verificationCodes[email] === code;
  }
}