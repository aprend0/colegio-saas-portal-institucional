import { Controller, Get, Query } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('resumen')
  resumenGeneral(@Query('colegioId') colegioId: string) {
    return this.reportesService.resumenGeneral(Number(colegioId));
  }

  @Get('financiero')
  reporteFinanciero(@Query('colegioId') colegioId: string) {
    return this.reportesService.reporteFinanciero(Number(colegioId));
  }

  @Get('academico')
  reporteAcademico(@Query('colegioId') colegioId: string) {
    return this.reportesService.reporteAcademico(Number(colegioId));
  }
}
