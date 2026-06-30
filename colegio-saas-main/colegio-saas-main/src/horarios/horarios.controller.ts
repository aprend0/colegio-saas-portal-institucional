import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  create(@Body() data: any) {
    return this.horariosService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('seccionId') seccionId?: string,
    @Query('cursoId') cursoId?: string,
    @Query('docenteId') docenteId?: string,
    @Query('dia') dia?: string,
  ) {
    return this.horariosService.findAll(
      colegioId ? Number(colegioId) : undefined,
      seccionId ? Number(seccionId) : undefined,
      cursoId ? Number(cursoId) : undefined,
      docenteId ? Number(docenteId) : undefined,
      dia,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horariosService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.horariosService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.horariosService.remove(Number(id));
  }
}
