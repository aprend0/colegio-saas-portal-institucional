import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Servicio del Super Admin — maneja la gestión de admins de los colegios
@Injectable()
export class SuperAdminService {
  constructor(
    private prisma: PrismaService, // Servicio de base de datos
  ) {}

// Crear un nuevo administrador para un colegio específico
async crearAdmin(nombre: string, email: string, password: string, colegioId: number) {
  // Encriptar la contraseña antes de guardarla
  const hash = await bcrypt.hash(password, 10);

  // Crear el admin en la base de datos asociado al colegio
  const admin = await this.prisma.admin.create({
    data: {
      nombre,
      email,
      password: hash,
      colegioId,
    },
    include: {
      colegio: true,
    },
  });

  // Eliminar la contraseña de la respuesta por seguridad
  const { password: _, ...adminSinPassword } = admin;
  return adminSinPassword;
}
 // Listar todos los admins registrados en la plataforma
async listarAdmins() {
  return this.prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    // Seleccionar solo los campos necesarios (sin contraseña por seguridad)
    select: {
      id: true,
      nombre: true,
      email: true,
      activo: true,
      createdAt: true,
      colegioId: true,
      colegio: {
        select: {
          id: true,
          nombre: true,
          activo: true,
        },
      },
    },
  });
}

  // Activar o desactivar un admin
  async cambiarEstadoAdmin(id: number, activo: boolean) {
    return this.prisma.admin.update({
      where: { id },
      data: { activo }, // Actualiza el campo activo (true/false)
    });
  }
}