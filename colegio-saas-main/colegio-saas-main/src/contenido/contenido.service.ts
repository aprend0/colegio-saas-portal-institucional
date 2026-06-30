import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Servicio de contenido — maneja comunicados, noticias, eventos y aniversarios
@Injectable()
export class ContenidoService {
  constructor(
    private prisma: PrismaService, // Servicio de base de datos
  ) {}

  // Crear nuevo contenido para un colegio
  async crear(datos: {
    tipo: string;       // Tipo: comunicado, noticia, evento, aniversario
    titulo: string;     // Título del contenido
    descripcion: string;// Descripción o cuerpo del contenido
    imagen?: string;    // URL de imagen opcional
    colegioId: number;  // ID del colegio al que pertenece
  }) {
    return this.prisma.contenido.create({
      data: datos,
    });
  }

  // Listar todo el contenido de un colegio específico
  async listarPorColegio(colegioId: number) {
    return this.prisma.contenido.findMany({
      where: { colegioId },
      orderBy: { createdAt: 'desc' }, // Más reciente primero
    });
  }

  // Listar contenido por tipo (comunicado, noticia, evento, aniversario)
  async listarPorTipo(colegioId: number, tipo: string) {
    return this.prisma.contenido.findMany({
      where: {
        colegioId,
        tipo,        // Filtrar por tipo de contenido
        activo: true,// Solo contenido activo
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Actualizar contenido existente
  async actualizar(id: number, datos: {
    titulo?: string;
    descripcion?: string;
    imagen?: string;
    activo?: boolean;
  }) {
    return this.prisma.contenido.update({
      where: { id },
      data: datos, // Solo actualiza los campos enviados
    });
  }

  // Eliminar contenido (desactivar)
  async eliminar(id: number) {
    return this.prisma.contenido.update({
      where: { id },
      data: { activo: false }, // No eliminamos, solo desactivamos
    });
  }

  // Listar todo el contenido público de un colegio (para la página pública)
  async listarPublico(colegioId: number) {
    return this.prisma.contenido.findMany({
      where: {
        colegioId,
        activo: true, // Solo contenido activo visible al público
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}