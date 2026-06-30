import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContenidoService {
  constructor(private prisma: PrismaService) {}

  findByColegioId(colegioId: number) {
    return this.prisma.contenido.findMany({
      where: { colegioId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPublico(colegioId: number) {
    return this.prisma.contenido.findMany({
      where: { colegioId, activo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: number, data: any) {
    const { file, ...dataToUpdate } = data;

    // Convertimos explícitamente colegioId a número si existe
    if (dataToUpdate.colegioId) {
      dataToUpdate.colegioId = parseInt(dataToUpdate.colegioId, 10);
    }

    return this.prisma.contenido.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  create(data: any) {
    // Aseguramos que colegioId sea entero
    const dataToCreate = {
      ...data,
      colegioId: parseInt(data.colegioId, 10)
    };
    
    return this.prisma.contenido.create({ data: dataToCreate });
  }

  desactivar(id: number) {
    return this.prisma.contenido.update({
      where: { id },
      data: { activo: false },
    });
  }

  eliminar(id: number) {
    return this.prisma.contenido.delete({
      where: { id },
    });
  }
}
