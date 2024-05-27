import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Evento } from '../Entity/evento.entity';
import * as nodemailer from 'nodemailer';
import * as qr from 'qr-image';

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
  async findAllInfoByUsuarioId(usuarioId: number): Promise<Evento[]> { //ver la info de las salas: http://192.168.1.90:3000/salas/usuarios/6/salas
    return await this.eventoRepository.createQueryBuilder("evento")
      .innerJoinAndSelect("evento.usuarios", "usuario")
      .where("usuario.id = :usuarioId", { usuarioId })
      .getMany();
  }
  async sendEmailWithQrCode(email: string, evento: Evento, cantidadEntradas: number): Promise<void> {
    // Configura el transportador de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'partywarsoficial@gmail.com',
        pass: 'xsmj uixl dfvz lgwk',
      },
    });

    // Genera el código QR
    const qrSvg = qr.image(JSON.stringify(evento), { type: 'png' });
    const qrData = await this.convertQrToBase64(qrSvg);
    console.log(email)
    console.log(evento)
    console.log(cantidadEntradas)
    console.log(cantidadEntradas * evento.precioEntrada + "€")
    const mailOptions = {
      from: 'partywarsoficial@gmail.com',
      to: email,
      subject: 'Confirmación de Compra de Entradas',
      html: `
        <h1>Confirmación de Compra</h1>
        <p>Gracias por tu compra. Aquí tienes los detalles del evento:</p>
        <ul>
          <li><strong>Nombre del evento:</strong> ${evento.nombreSala}</li>
          <li><strong>Fecha del evento:</strong> ${evento.fechaEvento}</li>
          <li><strong>Localización:</strong> ${evento.localizacion}</li>
          <li><strong>Cantidad de entradas:</strong> ${cantidadEntradas}</li>
          <li><strong>Precio total:</strong> ${cantidadEntradas * evento.precioEntrada}€</li>
        </ul>
        <p>Escanea el siguiente código QR en la entrada:</p>
        <img src="cid:qrCode" alt="QR Code"/>
      `,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrData,
          cid: 'qrCode',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  }

  private async convertQrToBase64(qrStream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      qrStream.on('data', (chunk) => chunks.push(chunk));
      qrStream.on('end', () => resolve(Buffer.concat(chunks)));
      qrStream.on('error', reject);
    });
  }
  
  async findByTematica(tematica: string): Promise<Evento[]> {
    return await this.eventoRepository.find({ where: { tematicaEvento: tematica } });
  }
}
  

