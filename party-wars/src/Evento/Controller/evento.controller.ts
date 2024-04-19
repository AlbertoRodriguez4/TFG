import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Evento } from '../Entity/evento.entity';
import { EventoService } from '../Service/evento.service';


@Controller('eventos')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Evento | undefined> {
    return this.eventoService.findOne(parseInt(id, 10));
  }

  @Post()
  create(@Body() evento: Evento): Promise<Evento> {
    return this.eventoService.create(evento);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() eventData: Partial<Evento>): Promise<Evento | undefined> {
    return this.eventoService.update(parseInt(id, 10), eventData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.eventoService.remove(parseInt(id, 10));
  }
}
