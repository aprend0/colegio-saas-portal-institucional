import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotasService } from './notas.service';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  create(@Body() data: any) {
    return this.notasService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('estudianteId') estudianteId?: string,
    @Query('cursoId') cursoId?: string,
    @Query('periodo') periodo?: string,
  ) {
    return this.notasService.findAll(
      colegioId ? Number(colegioId) : undefined,
      estudianteId ? Number(estudianteId) : undefined,
      cursoId ? Number(cursoId) : undefined,
      periodo,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notasService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.notasService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.notasService.remove(Number(id));
  }
}
