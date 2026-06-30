import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Servicio de colegios — maneja toda la lógica de gestión de colegios
@Injectable()
export class ColegioService {
  constructor(
    private prisma: PrismaService, // Servicio de base de datos
  ) {}

  // Crear un nuevo colegio en la plataforma
  async crear(nombre: string) {
    return this.prisma.colegio.create({
      data: {
        nombre, // Nombre del colegio
      },
    });
  }

  // Obtener la lista completa de todos los colegios registrados
  async listarTodos() {
    return this.prisma.colegio.findMany({
      orderBy: { createdAt: 'desc' }, // Ordenar por fecha de creación descendente
      include: {
        admin: true, // Incluir los admins de cada colegio
      },
    });
  }

  // Obtener un colegio específico por su ID
  async obtenerPorId(id: number) {
    return this.prisma.colegio.findUnique({
      where: { id },
      include: {
        admin: true,      // Incluir admins del colegio
        contenido: true,  // Incluir contenido del colegio
      },
    });
  }

  // Activar o desactivar un colegio
  async cambiarEstado(id: number, activo: boolean) {
    return this.prisma.colegio.update({
      where: { id },
      data: { activo }, // Actualiza el campo activo (true/false)
    });
  }

  // Actualizar los datos de personalización del colegio
  async actualizar(id: number, datos: {
    nombre?: string;
    logo?: string;
    colorPrimario?: string;
    colorSecundario?: string;
  }) {
    return this.prisma.colegio.update({
      where: { id },
      data: datos, // Solo actualiza los campos enviados
    });
  }
}