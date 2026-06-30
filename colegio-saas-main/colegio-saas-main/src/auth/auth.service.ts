import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Servicio de autenticación — maneja el login de Super Admin y Admin del colegio
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,       // Servicio de base de datos
    private jwtService: JwtService,      // Servicio para generar tokens JWT
  ) {}

  // Método para autenticar al Super Admin con email y contraseña
  async loginSuperAdmin(email: string, password: string) {

    // Buscar al Super Admin en la base de datos por su email
    const superAdmin = await this.prisma.superAdmin.findUnique({
      where: { email },
    });

    // Si no existe el usuario, lanzar error de credenciales incorrectas
    if (!superAdmin) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Comparar la contraseña ingresada con el hash guardado en la base de datos
    const passwordValid = await bcrypt.compare(password, superAdmin.password);

    // Si la contraseña no coincide, lanzar error
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Crear el payload del token JWT con los datos del Super Admin
    const payload = {
      sub: superAdmin.id,           // ID del Super Admin
      email: superAdmin.email,      // Email del Super Admin
      rol: 'super-admin',           // Rol para identificar permisos
    };

    // Retornar el token JWT generado y el rol del usuario
    return {
      access_token: this.jwtService.sign(payload),
      rol: 'super-admin',
    };
  }

  // Método para autenticar al Admin del colegio con email y contraseña
  async loginAdmin(email: string, password: string) {

    // Buscar al Admin en la base de datos por su email
    const admin = await this.prisma.admin.findUnique({
      where: { email },
      include: {
        colegio: true, // Incluir datos del colegio del admin
      },
    });

    // Si no existe el usuario, lanzar error
    if (!admin) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar que el admin esté activo
    if (!admin.activo) {
      throw new UnauthorizedException('Tu cuenta está desactivada');
    }

    // Verificar que el colegio esté activo
    if (!admin.colegio.activo) {
      throw new UnauthorizedException('Tu colegio está desactivado');
    }

    // Comparar la contraseña ingresada con el hash guardado
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Crear el payload del token JWT con los datos del Admin
    const payload = {
      sub: admin.id,              // ID del Admin
      email: admin.email,         // Email del Admin
      rol: 'admin',               // Rol para identificar permisos
      colegioId: admin.colegioId, // ID del colegio al que pertenece
    };

    // Retornar el token JWT y datos del admin
    return {
      access_token: this.jwtService.sign(payload),
      rol: 'admin',
      colegioId: admin.colegioId,
      nombre: admin.nombre,
    };
  }
}