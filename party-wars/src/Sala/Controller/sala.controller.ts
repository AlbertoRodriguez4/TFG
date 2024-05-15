import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Sala } from '../Entity/sala.entity';
import { SalaService } from '../Service/sala.service';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Get()
  findAll(): Promise<Sala[]> {
    return this.salaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sala | undefined> {
    return this.salaService.findOne(parseInt(id, 10));
  }

  @Post()
  async create(@Body() salaData: Partial<Sala>): Promise<number> {
    try {
      const salaId = await this.salaService.create(salaData);
      console.log(salaId);
      return salaId; // Devuelve el ID de la sala creada
    } catch (error) {
      // Manejo de errores si la creación de la sala falla
      console.error('Error al crear la sala:', error);
      throw error;
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() salaData: Partial<Sala>): Promise<Sala | undefined> {
    return this.salaService.update(parseInt(id, 10), salaData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.salaService.remove(parseInt(id, 10));
  }

  @Post(':id/juegos/:juegoId')
  async addJuegoToSala(@Param('id') salaId: string, @Param('juegoId') juegoId: string): Promise<void> {
    await this.salaService.addJuegoToSala(parseInt(salaId, 10), parseInt(juegoId, 10));
  }
  
  @Delete(':id/juegos/:juegoId')
  async removeJuegoFromSala(@Param('id') salaId: string, @Param('juegoId') juegoId: string): Promise<void> {
    await this.salaService.removeJuegoFromSala(parseInt(salaId, 10), parseInt(juegoId, 10));
  }
  
  @Post(':id/usuarios/:usuarioId')
  async addUsuarioToSala(@Param('id') salaId: string, @Param('usuarioId') usuarioId: string): Promise<void> {
    await this.salaService.addUsuarioToSala(parseInt(salaId, 10), parseInt(usuarioId, 10));
  }
  
  @Delete(':id/usuarios/:usuarioId')
  async removeUsuarioFromSala(@Param('id') salaId: string, @Param('usuarioId') usuarioId: string): Promise<void> {
    await this.salaService.removeUsuarioFromSala(parseInt(salaId, 10), parseInt(usuarioId, 10));
  }


  @Get(':id/juegos')
  async findAllJuegosBySalaId(@Param('id') salaId: string): Promise<any[]> {
    return this.salaService.findAllJuegosBySalaId(parseInt(salaId, 10));
  }

  @Get(':id/usuarios')
  async findAllUsuariosBySalaId(@Param('id') salaId: string): Promise<any[]> {
    return this.salaService.findAllUsuariosBySalaId(parseInt(salaId, 10));
  }
 
  @Get('usuarios/:usuarioId/salas')
  async findSalasAndInfoByUsuarioId(@Param('usuarioId') usuarioId: string): Promise<Sala[]> {
    return this.salaService.findAllInfoByUsuarioId(parseInt(usuarioId, 10));
  }
  @Get('tematica/:tematica')
  async findByTematica(@Param('tematica') tematica: string) {
    return await this.salaService.findByTematica(tematica);
  }
  @Get('nombre/:nombre')
  async findByNombre(@Param('nombre') nombre: string) {
    return await this.salaService.findByNombre(nombre);
  }
}



