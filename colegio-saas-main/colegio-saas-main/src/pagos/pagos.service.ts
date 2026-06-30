import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.pago.create({
      data,
      include: {
        colegio: true,
        estudiante: true,
      },
    });
  }

  findAll(colegioId?: number, estudianteId?: number, estado?: string) {
    return this.prisma.pago.findMany({
      where: {
        ...(colegioId ? { colegioId } : {}),
        ...(estudianteId ? { estudianteId } : {}),
        ...(estado ? { estado } : {}),
      },
      include: {
        estudiante: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pago.findUnique({
      where: { id },
      include: {
        colegio: true,
        estudiante: true,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.pago.update({
      where: { id },
      data,
      include: {
        estudiante: true,
      },
    });
  }

  marcarPagado(id: number, data: any) {
    return this.prisma.pago.update({
      where: { id },
      data: {
        estado: 'PAGADO',
        fechaPago: data.fechaPago || new Date(),
        metodoPago: data.metodoPago,
        comprobante: data.comprobante,
        observacion: data.observacion,
      },
      include: {
        estudiante: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.pago.update({
      where: { id },
      data: {
        activo: false,
      },
    });
  }
}
