import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.estudiante.create({
      data,
      include: {
        colegio: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        matriculas: true,
      },
    });
  }

  findAll(colegioId?: number, seccionId?: number) {
    return this.prisma.estudiante.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(seccionId ? { seccionId } : {}),
      },
      include: {
        seccion: {
          include: {
            grado: true,
          },
        },
        matriculas: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.estudiante.findUnique({
      where: { id },
      include: {
        colegio: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        matriculas: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.estudiante.update({
      where: { id },
      data,
      include: {
        seccion: {
          include: {
            grado: true,
          },
        },
        matriculas: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.estudiante.update({
      where: { id },
      data: { activo: false },
    });
  }
}
