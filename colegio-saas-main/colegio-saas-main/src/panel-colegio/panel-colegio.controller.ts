import { Controller, Get, Param, Query } from '@nestjs/common';
import { PanelColegioService } from './panel-colegio.service';

@Controller('panel-colegio')
export class PanelColegioController {
  constructor(private readonly panelColegioService: PanelColegioService) {}

  @Get(':colegioId/dashboard')
  dashboard(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.dashboard(Number(colegioId));
  }

  @Get(':colegioId/estudiantes')
  estudiantes(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.estudiantes(Number(colegioId));
  }

  @Get(':colegioId/pagos')
  pagos(
    @Param('colegioId') colegioId: string,
    @Query('estado') estado?: string,
  ) {
    return this.panelColegioService.pagos(Number(colegioId), estado);
  }

  @Get(':colegioId/notas')
  notas(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.notas(Number(colegioId));
  }

  @Get(':colegioId/asistencias')
  asistencias(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.asistencias(Number(colegioId));
  }

  @Get(':colegioId/horarios')
  horarios(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.horarios(Number(colegioId));
  }

  @Get(':colegioId/contenido')
  contenido(@Param('colegioId') colegioId: string) {
    return this.panelColegioService.contenido(Number(colegioId));
  }
}
