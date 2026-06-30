import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CursosService } from './cursos.service';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  create(@Body() data: any) {
    return this.cursosService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('gradoId') gradoId?: string,
    @Query('docenteId') docenteId?: string,
  ) {
    return this.cursosService.findAll(
      colegioId ? Number(colegioId) : undefined,
      gradoId ? Number(gradoId) : undefined,
      docenteId ? Number(docenteId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.cursosService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(Number(id));
  }
}
