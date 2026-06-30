import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DocentesService } from './docentes.service';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Post()
  create(@Body() data: any) {
    return this.docentesService.create(data);
  }

  @Get()
  findAll(@Query('colegioId') colegioId?: string) {
    return this.docentesService.findAll(colegioId ? Number(colegioId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.docentesService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.docentesService.remove(Number(id));
  }
}
