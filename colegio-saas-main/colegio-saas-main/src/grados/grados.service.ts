import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.grado.create({
      data,
      include: {
        colegio: true,
        secciones: true,
        cursos: true,
      },
    });
  }

  findAll(colegioId?: number) {
    return this.prisma.grado.findMany({
      where: colegioId ? { colegioId } : {},
      include: {
        secciones: true,
        cursos: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.grado.findUnique({
      where: { id },
      include: {
        colegio: true,
        secciones: true,
        cursos: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.grado.update({
      where: { id },
      data,
      include: {
        secciones: true,
        cursos: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.grado.update({
      where: { id },
      data: { activo: false },
    });
  }
}
