import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PanelColegioService {
  constructor(private prisma: PrismaService) {}

  async dashboard(colegioId: number) {
    const [
      colegio,
      estudiantes,
      docentes,
      cursos,
      grados,
      secciones,
      matriculas,
      pagosPendientes,
      pagosPagados,
      montoPendiente,
      montoPagado,
      notasPromedio,
      asistenciasPresentes,
      asistenciasFaltas,
      ultimosComunicados,
      ultimosPagos,
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

      this.prisma.curso.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.grado.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.seccion.count({
        where: { colegioId, activo: true },
      }),

      this.prisma.matricula.count({
        where: { colegioId, estado: 'ACTIVA' },
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

      this.prisma.contenido.findMany({
        where: { colegioId, activo: true },
        orderBy: { id: 'desc' },
        take: 5,
      }),

      this.prisma.pago.findMany({
        where: { colegioId, activo: true },
        include: { estudiante: true },
        orderBy: { id: 'desc' },
        take: 5,
      }),
    ]);

    return {
      colegio,
      cards: {
        estudiantes,
        docentes,
        cursos,
        grados,
        secciones,
        matriculas,
        pagosPendientes,
        pagosPagados,
        montoPendiente: montoPendiente._sum.monto || 0,
        montoPagado: montoPagado._sum.monto || 0,
        promedioNotas: notasPromedio._avg.calificacion || 0,
        asistenciasPresentes,
        asistenciasFaltas,
      },
      ultimosComunicados,
      ultimosPagos,
    };
  }

  estudiantes(colegioId: number) {
    return this.prisma.estudiante.findMany({
      where: { colegioId, activo: true },
      include: {
        seccion: {
          include: {
            grado: true,
          },
        },
        matriculas: true,
        notas: {
          include: {
            curso: true,
          },
        },
        pagos: true,
        asistencias: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  pagos(colegioId: number, estado?: string) {
    return this.prisma.pago.findMany({
      where: {
        colegioId,
        activo: true,
        ...(estado ? { estado } : {}),
      },
      include: {
        estudiante: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  notas(colegioId: number) {
    return this.prisma.nota.findMany({
      where: { colegioId, activo: true },
      include: {
        estudiante: true,
        curso: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  asistencias(colegioId: number) {
    return this.prisma.asistencia.findMany({
      where: { colegioId, activo: true },
      include: {
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  horarios(colegioId: number) {
    return this.prisma.horario.findMany({
      where: { colegioId, activo: true },
      include: {
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
        docente: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  contenido(colegioId: number) {
    return this.prisma.contenido.findMany({
      where: { colegioId, activo: true },
      orderBy: {
        id: 'desc',
      },
    });
  }
}
