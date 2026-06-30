import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post()
  create(@Body() data: any) {
    return this.estudiantesService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('seccionId') seccionId?: string,
  ) {
    return this.estudiantesService.findAll(
      colegioId ? Number(colegioId) : undefined,
      seccionId ? Number(seccionId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estudiantesService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.estudiantesService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(Number(id));
  }
}
