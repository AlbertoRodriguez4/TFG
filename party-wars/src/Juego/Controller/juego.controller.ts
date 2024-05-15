import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Juego } from '../Entity/juego.entity';
import { Pregunta } from '../Entity/pregunta.entity';
import { JuegosService } from '../Service/juego.service';

@Controller('juegos')
export class JuegosController {
  constructor(private readonly juegosService: JuegosService) {}

  @Get()
  findAll(): Promise<Juego[]> {
    return this.juegosService.findAll();
  }

  @Post()
  create(@Body() juego: Juego): Promise<Juego> {
    return this.juegosService.create(juego);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.juegosService.delete(id);
  }
  @Get('preguntas')
  findAllPreguntas(): Promise<Pregunta[]> {
    return this.juegosService.findAllPreguntas();
  }
  @Post('preguntas')
  createPregunta(@Body() pregunta: Pregunta): Promise<Pregunta> {
    return this.juegosService.createPregunta(pregunta);
  }
  @Post(':id/preguntas/:preguntaId')
  async addPreguntaToJuego(@Param('id') juegoId: number, @Param('preguntaId') preguntaId: number): Promise<void> {
    await this.juegosService.addPreguntaToJuego(juegoId, preguntaId);
  }
  @Get(':id/preguntas')
  findPreguntasByJuegoId(@Param('id') juegoId: number): Promise<Pregunta[]> {
    return this.juegosService.findPreguntasByJuegoId(juegoId);
  }
  
}
