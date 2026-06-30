import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeccionesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.seccion.create({
      data,
      include: {
        colegio: true,
        grado: true,
        estudiantes: true,
        matriculas: true,
      },
    });
  }

  findAll(colegioId?: number, gradoId?: number) {
    return this.prisma.seccion.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(gradoId ? { gradoId } : {}),
      },
      include: {
        grado: true,
        estudiantes: true,
        matriculas: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.seccion.findUnique({
      where: { id },
      include: {
        colegio: true,
        grado: true,
        estudiantes: true,
        matriculas: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.seccion.update({
      where: { id },
      data,
      include: {
        grado: true,
        estudiantes: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.seccion.update({
      where: { id },
      data: { activo: false },
    });
  }
}
