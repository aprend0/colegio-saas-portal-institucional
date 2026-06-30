import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.horario.create({
      data,
      include: {
        colegio: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
        docente: true,
      },
    });
  }

  findAll(
    colegioId?: number,
    seccionId?: number,
    cursoId?: number,
    docenteId?: number,
    dia?: string,
  ) {
    return this.prisma.horario.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(seccionId ? { seccionId } : {}),
        ...(cursoId ? { cursoId } : {}),
        ...(docenteId ? { docenteId } : {}),
        ...(dia ? { dia } : {}),
        activo: true,
      },
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

  findOne(id: number) {
    return this.prisma.horario.findUnique({
      where: { id },
      include: {
        colegio: true,
        seccion: {
          include: {
            grado: true,
          },
        },
        curso: true,
        docente: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.horario.update({
      where: { id },
      data,
      include: {
        seccion: true,
        curso: true,
        docente: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.horario.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
