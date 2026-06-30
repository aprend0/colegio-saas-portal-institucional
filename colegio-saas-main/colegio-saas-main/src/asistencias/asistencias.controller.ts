import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';

@Controller('asistencias')
export class AsistenciasController {
  constructor(private readonly asistenciasService: AsistenciasService) {}

  @Post()
  create(@Body() data: any) {
    return this.asistenciasService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('estudianteId') estudianteId?: string,
    @Query('seccionId') seccionId?: string,
    @Query('cursoId') cursoId?: string,
    @Query('estado') estado?: string,
  ) {
    return this.asistenciasService.findAll(
      colegioId ? Number(colegioId) : undefined,
      estudianteId ? Number(estudianteId) : undefined,
      seccionId ? Number(seccionId) : undefined,
      cursoId ? Number(cursoId) : undefined,
      estado,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asistenciasService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.asistenciasService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.asistenciasService.remove(Number(id));
  }
}
