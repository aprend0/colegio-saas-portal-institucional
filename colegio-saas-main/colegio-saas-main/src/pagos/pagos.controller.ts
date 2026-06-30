import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  create(@Body() data: any) {
    return this.pagosService.create(data);
  }

  @Get()
  findAll(
    @Query('colegioId') colegioId?: string,
    @Query('estudianteId') estudianteId?: string,
    @Query('estado') estado?: string,
  ) {
    return this.pagosService.findAll(
      colegioId ? Number(colegioId) : undefined,
      estudianteId ? Number(estudianteId) : undefined,
      estado,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.pagosService.update(Number(id), data);
  }

  @Patch(':id/pagado')
  marcarPagado(@Param('id') id: string, @Body() data: any) {
    return this.pagosService.marcarPagado(Number(id), data);
  }

  @Patch(':id/eliminar')
  remove(@Param('id') id: string) {
    return this.pagosService.remove(Number(id));
  }
}
