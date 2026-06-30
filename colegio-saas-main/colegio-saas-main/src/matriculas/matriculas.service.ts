import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.matricula.create({
      data,
      include: {
        colegio: true,
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
      },
    });
  }

  findAll(colegioId?: number, estudianteId?: number, seccionId?: number, anio?: number) {
    return this.prisma.matricula.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(estudianteId ? { estudianteId } : {}),
        ...(seccionId ? { seccionId } : {}),
        ...(anio ? { anio } : {}),
      },
      include: {
        estudiante: true,
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

  findOne(id: number) {
    return this.prisma.matricula.findUnique({
      where: { id },
      include: {
        colegio: true,
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.matricula.update({
      where: { id },
      data,
      include: {
        estudiante: true,
        seccion: {
          include: {
            grado: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.matricula.update({
      where: { id },
      data: { estado: 'ANULADA' },
    });
  }
}
