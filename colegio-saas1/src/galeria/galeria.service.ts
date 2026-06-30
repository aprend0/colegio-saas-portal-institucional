import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GaleriaService {
  constructor(private prisma: PrismaService) {}

  // Agregado 'async' para consistencia con operaciones de DB
  async findByColegioId(colegioId: number) {
    return this.prisma.galeria.findMany({
      where: { 
        colegioId, 
        activo: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Agregado 'async'
  async create(data: { titulo: string; imagen: string; categoria?: string; colegioId: number }) {
    return this.prisma.galeria.create({ 
      data: {
        titulo: data.titulo,
        imagen: data.imagen,
        categoria: data.categoria || 'General', // Valor por defecto si es opcional
        colegioId: data.colegioId
      } 
    });
  }

  async eliminar(id: number) {
    return this.prisma.galeria.update({
      where: { id },
      data: { activo: false },
    });
  }
}
