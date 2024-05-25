import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Usuario } from '../Entity/usuario.entity';
import { UsuarioService } from '../Service/usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Usuario | undefined> {
    return this.usuarioService.findOne(parseInt(id, 10));
  }

  @Post()
  create(@Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    console.log('imagen ' + usuarioData.imagen); // Verifica que la imagen no sea null aquí
    return this.usuarioService.create(usuarioData);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() usuarioData: Partial<Usuario>,
  ): Promise<Usuario | undefined> {
    return this.usuarioService.update(parseInt(id, 10), usuarioData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usuarioService.remove(parseInt(id, 10));
  }

  @Get('login/:correo/:password')
  async login(
    @Param('correo') correo: string,
    @Param('password') password: string,
  ): Promise<Usuario | null> {
    return this.usuarioService.findByEmailAndPassword(correo, password);
  }

  @Put(':id/plan')
  updatePlan(
    @Param('id') id: string,
    @Body('plan') plan: string,
  ): Promise<Usuario | undefined> {
    return this.usuarioService.updatePlan(parseInt(id, 10), plan);
  }
}
