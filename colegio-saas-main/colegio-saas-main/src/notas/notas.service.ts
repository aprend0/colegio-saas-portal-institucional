import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotasService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.nota.create({
      data,
      include: {
        colegio: true,
        estudiante: true,
        curso: true,
      },
    });
  }

  findAll(colegioId?: number, estudianteId?: number, cursoId?: number, periodo?: string) {
    return this.prisma.nota.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(estudianteId ? { estudianteId } : {}),
        ...(cursoId ? { cursoId } : {}),
        ...(periodo ? { periodo } : {}),
      },
      include: {
        estudiante: true,
        curso: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.nota.findUnique({
      where: { id },
      include: {
        colegio: true,
        estudiante: true,
        curso: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.nota.update({
      where: { id },
      data,
      include: {
        estudiante: true,
        curso: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.nota.update({
      where: { id },
      data: { activo: false },
    });
  }
}
