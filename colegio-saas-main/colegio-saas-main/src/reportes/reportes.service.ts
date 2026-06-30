import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  async resumenGeneral(colegioId: number) {
    const [
      colegio,
      estudiantes,
      docentes,
      grados,
      secciones,
      cursos,
      matriculas,
      notas,
      asistencias,
      pagosPendientes,
      pagosPagados,
      montoPendiente,
      montoPagado,
      promedioNotas,
      asistenciasPresentes,
      asistenciasFaltas,
    ] = await Promise.all([
      this.prisma.colegio.findUnique({
        where: { id: colegioId },
      }),

      this.prisma.estudiante.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.docente.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.grado.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.seccion.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.curso.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.matricula.count({
        where: { colegioId, estado: 'ACTIVA' },
      }),

      this.prisma.nota.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.asistencia.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.pago.count({
        where: { colegioId, estado: 'PENDIENTE', activo: true },
      }),

      this.prisma.pago.count({
        where: { colegioId, estado: 'PAGADO', activo: true },
      }),

      this.prisma.pago.aggregate({
        where: { colegioId, estado: 'PENDIENTE', activo: true },
        _sum: { monto: true },
      }),

      this.prisma.pago.aggregate({
        where: { colegioId, estado: 'PAGADO', activo: true },
        _sum: { monto: true },
      }),

      this.prisma.nota.aggregate({
        where: { colegioId, activo: true },
        _avg: { calificacion: true },
      }),

      this.prisma.asistencia.count({
        where: { colegioId, estado: 'PRESENTE', activo: true },
      }),

      this.prisma.asistencia.count({
        where: { colegioId, estado: 'FALTA', activo: true },
      }),
    ]);

    return {
      colegio,
      academico: {
        estudiantes,
        docentes,
        grados,
        secciones,
        cursos,
        matriculasActivas: matriculas,
        notasRegistradas: notas,
        promedioNotas: promedioNotas._avg.calificacion || 0,
      },
      asistencia: {
        totalRegistros: asistencias,
        presentes: asistenciasPresentes,
        faltas: asistenciasFaltas,
      },
      financiero: {
        pagosPendientes,
        pagosPagados,
        montoPendiente: montoPendiente._sum.monto || 0,
        montoPagado: montoPagado._sum.monto || 0,
      },
    };
  }

  async reporteFinanciero(colegioId: number) {
    const pagos = await this.prisma.pago.findMany({
      where: { colegioId, activo: true },
      include: {
        estudiante: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const totalPendiente = pagos
      .filter((pago) => pago.estado === 'PENDIENTE')
      .reduce((total, pago) => total + pago.monto, 0);

    const totalPagado = pagos
      .filter((pago) => pago.estado === 'PAGADO')
      .reduce((total, pago) => total + pago.monto, 0);

    return {
      totalPagado,
      totalPendiente,
      cantidadPagos: pagos.length,
      pagos,
    };
  }

  async reporteAcademico(colegioId: number) {
    const estudiantes = await this.prisma.estudiante.findMany({
      where: { colegioId, activo: true },
      include: {
        seccion: {
          include: {
            grado: true,
          },
        },
        notas: {
          include: {
            curso: true,
          },
        },
        asistencias: true,
        matriculas: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return estudiantes.map((estudiante) => {
      const promedio =
        estudiante.notas.length > 0
          ? estudiante.notas.reduce((sum, nota) => sum + nota.calificacion, 0) /
            estudiante.notas.length
          : 0;

      const asistencias = estudiante.asistencias.length;
      const presentes = estudiante.asistencias.filter(
        (asistencia) => asistencia.estado === 'PRESENTE',
      ).length;

      return {
        id: estudiante.id,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        dni: estudiante.dni,
        grado: estudiante.seccion?.grado?.nombre || null,
        seccion: estudiante.seccion?.nombre || null,
        promedio,
        asistencias,
        presentes,
        notas: estudiante.notas,
        matriculas: estudiante.matriculas,
      };
    });
  }
}
