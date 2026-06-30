import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.docente.create({
      data,
      include: {
        colegio: true,
        cursos: true,
      },
    });
  }

  findAll(colegioId?: number) {
    return this.prisma.docente.findMany({
      where: colegioId ? { colegioId } : {},
      include: {
        cursos: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.docente.findUnique({
      where: { id },
      include: {
        colegio: true,
        cursos: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.docente.update({
      where: { id },
      data,
      include: {
        cursos: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.docente.update({
      where: { id },
      data: { activo: false },
    });
  }
}
