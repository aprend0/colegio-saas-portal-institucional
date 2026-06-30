import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.curso.create({
      data,
      include: {
        colegio: true,
        grado: true,
        docente: true,
      },
    });
  }

  findAll(colegioId?: number, gradoId?: number, docenteId?: number) {
    return this.prisma.curso.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(gradoId ? { gradoId } : {}),
        ...(docenteId ? { docenteId } : {}),
      },
      include: {
        grado: true,
        docente: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({
      where: { id },
      include: {
        colegio: true,
        grado: true,
        docente: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.curso.update({
      where: { id },
      data,
      include: {
        grado: true,
        docente: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.curso.update({
      where: { id },
      data: { activo: false },
    });
  }
}
