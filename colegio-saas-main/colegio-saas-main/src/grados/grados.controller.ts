import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GradosService } from './grados.service';

@Controller('grados')
export class GradosController {
  constructor(private readonly gradosService: GradosService) {}

  @Post()
  create(@Body() data: any) {
    return this.gradosService.create(data);
  }

  @Get()
  findAll(@Query('colegioId') colegioId?: string) {
    return this.gradosService.findAll(colegioId ? Number(colegioId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradosService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.gradosService.update(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.gradosService.remove(Number(id));
  }
}
