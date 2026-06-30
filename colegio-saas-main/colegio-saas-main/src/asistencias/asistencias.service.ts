import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AsistenciasService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.asistencia.create({
      data,
      include: {
        colegio: true,
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
      },
    });
  }

  findAll(
    colegioId?: number,
    estudianteId?: number,
    seccionId?: number,
    cursoId?: number,
    estado?: string,
  ) {
    return this.prisma.asistencia.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(estudianteId ? { estudianteId } : {}),
        ...(seccionId ? { seccionId } : {}),
        ...(cursoId ? { cursoId } : {}),
        ...(estado ? { estado } : {}),
      },
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

  findOne(id: number) {
    return this.prisma.asistencia.findUnique({
      where: { id },
      include: {
        colegio: true,
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.asistencia.update({
      where: { id },
      data,
      include: {
        estudiante: true,
        seccion: true,
        curso: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.asistencia.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
