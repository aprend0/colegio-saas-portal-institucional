import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ColegioService } from './colegio.service';
import { UpdateColegioDto } from './dto/update-colegio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('colegio')
export class ColegioController {
  constructor(private readonly colegioService: ColegioService) {}

  // Rutas públicas PRIMERO
  @Get('publico/:id')
  findPublico(@Param('id') id: string) {
    return this.colegioService.findOne(+id);
  }

  // Rutas protegidas
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.colegioService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: any) {
    return this.colegioService.create(body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.colegioService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateColegioDto) {
    return this.colegioService.update(+id, dto);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  toggleEstado(@Param('id') id: string) {
    return this.colegioService.toggleEstado(+id);
  }
}
