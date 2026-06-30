import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  create(@Body() data: any) {
    return this.matriculasService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('estudianteId') estudianteId?: string,
    @Query('seccionId') seccionId?: string,
    @Query('anio') anio?: string,
  ) {
    return this.matriculasService.findAll(
      colegioId ? Number(colegioId) : undefined,
      estudianteId ? Number(estudianteId) : undefined,
      seccionId ? Number(seccionId) : undefined,
      anio ? Number(anio) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculasService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.matriculasService.update(Number(id), data);
  }

  @Patch(':id/anular')
  remove(@Param('id') id: string) {
    return this.matriculasService.remove(Number(id));
  }
}
