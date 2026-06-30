import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortalEstudianteService {
  constructor(private prisma: PrismaService) {}

  async resumen(estudianteId: number, colegioId?: number) {
    const estudiante = await this.prisma.estudiante.findFirst({
      where: {
        id: estudianteId,
        activo: true,
        ...(colegioId ? { colegioId } : {}),
      },
      include: {
        colegio: true,
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
          orderBy: {
            id: 'desc',
          },
        },
        asistencias: {
          include: {
            curso: true,
          },
          orderBy: {
            fecha: 'desc',
          },
        },
        pagos: {
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!estudiante) {
      return {
        message: 'Estudiante no encontrado',
      };
    }

    const promedio =
      estudiante.notas.length > 0
        ? estudiante.notas.reduce((sum, nota) => sum + nota.calificacion, 0) /
          estudiante.notas.length
        : 0;

    const totalAsistencias = estudiante.asistencias.length;
    const presentes = estudiante.asistencias.filter(
      (asistencia) => asistencia.estado === 'PRESENTE',
    ).length;
    const faltas = estudiante.asistencias.filter(
      (asistencia) => asistencia.estado === 'FALTA',
    ).length;

    const pagosPendientes = estudiante.pagos.filter(
      (pago) => pago.estado === 'PENDIENTE',
    );

    const pagosPagados = estudiante.pagos.filter(
      (pago) => pago.estado === 'PAGADO',
    );

    const montoPendiente = pagosPendientes.reduce(
      (sum, pago) => sum + pago.monto,
      0,
    );

    const montoPagado = pagosPagados.reduce((sum, pago) => sum + pago.monto, 0);

    const horarios = estudiante.seccionId
      ? await this.prisma.horario.findMany({
          where: {
            seccionId: estudiante.seccionId,
            activo: true,
          },
          include: {
            curso: true,
            docente: true,
            seccion: {
              include: {
                grado: true,
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        })
      : [];

    const comunicados = await this.prisma.contenido.findMany({
      where: {
        colegioId: estudiante.colegioId,
        activo: true,
      },
      orderBy: {
        id: 'desc',
      },
      take: 5,
    });

    return {
      estudiante,
      resumen: {
        promedio,
        totalAsistencias,
        presentes,
        faltas,
        pagosPendientes: pagosPendientes.length,
        pagosPagados: pagosPagados.length,
        montoPendiente,
        montoPagado,
      },
      horarios,
      comunicados,
    };
  }

  notas(estudianteId: number) {
    return this.prisma.nota.findMany({
      where: {
        estudianteId,
        activo: true,
      },
      include: {
        curso: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  asistencias(estudianteId: number) {
    return this.prisma.asistencia.findMany({
      where: {
        estudianteId,
        activo: true,
      },
      include: {
        curso: true,
        seccion: {
          include: {
            grado: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
  }

  pagos(estudianteId: number, estado?: string) {
    return this.prisma.pago.findMany({
      where: {
        estudianteId,
        activo: true,
        ...(estado ? { estado } : {}),
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async horario(estudianteId: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id: estudianteId,
      },
    });

    if (!estudiante?.seccionId) {
      return [];
    }

    return this.prisma.horario.findMany({
      where: {
        seccionId: estudiante.seccionId,
        activo: true,
      },
      include: {
        curso: true,
        docente: true,
        seccion: {
          include: {
            grado: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
