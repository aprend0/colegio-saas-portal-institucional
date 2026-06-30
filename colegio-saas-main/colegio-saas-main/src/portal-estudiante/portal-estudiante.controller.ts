import { Controller, Get, Param, Query } from '@nestjs/common';
import { PortalEstudianteService } from './portal-estudiante.service';

@Controller('portal-estudiante')
export class PortalEstudianteController {
  constructor(private readonly portalEstudianteService: PortalEstudianteService) {}

  @Get(':estudianteId/resumen')
  resumen(
    @Param('estudianteId') estudianteId: string,
    @Query('colegioId') colegioId?: string,
  ) {
    return this.portalEstudianteService.resumen(
      Number(estudianteId),
      colegioId ? Number(colegioId) : undefined,
    );
  }

  @Get(':estudianteId/notas')
  notas(@Param('estudianteId') estudianteId: string) {
    return this.portalEstudianteService.notas(Number(estudianteId));
  }

  @Get(':estudianteId/asistencias')
  asistencias(@Param('estudianteId') estudianteId: string) {
    return this.portalEstudianteService.asistencias(Number(estudianteId));
  }

  @Get(':estudianteId/pagos')
  pagos(
    @Param('estudianteId') estudianteId: string,
    @Query('estado') estado?: string,
  ) {
    return this.portalEstudianteService.pagos(Number(estudianteId), estado);
  }

  @Get(':estudianteId/horario')
  horario(@Param('estudianteId') estudianteId: string) {
    return this.portalEstudianteService.horario(Number(estudianteId));
  }
}
