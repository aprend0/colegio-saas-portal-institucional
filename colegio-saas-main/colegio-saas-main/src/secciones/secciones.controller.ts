import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SeccionesService } from './secciones.service';

@Controller('secciones')
export class SeccionesController {
  constructor(private readonly seccionesService: SeccionesService) {}

  @Post()
  create(@Body() data: any) {
    return this.seccionesService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('gradoId') gradoId?: string,
  ) {
    return this.seccionesService.findAll(
      colegioId ? Number(colegioId) : undefined,
      gradoId ? Number(gradoId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seccionesService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.seccionesService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.seccionesService.remove(Number(id));
  }
}
