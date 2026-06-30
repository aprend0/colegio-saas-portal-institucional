import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Controlador del Super Admin — define las rutas de gestión de admins
// @UseGuards(JwtAuthGuard) protege todas las rutas con autenticación JWT
@Controller('super-admin')
@UseGuards(JwtAuthGuard)
export class SuperAdminController {
  constructor(
    private superAdminService: SuperAdminService, // Inyección del servicio
  ) {}

  // POST /super-admin/admin — crear un nuevo admin para un colegio
  @Post('admin')
  crearAdmin(
    @Body() body: {
      nombre: string;
      email: string;
      password: string;
      colegioId: number; // ID del colegio al que pertenecerá el admin
    },
  ) {
    return this.superAdminService.crearAdmin(
      body.nombre,
      body.email,
      body.password,
      body.colegioId,
    );
  }

  // GET /super-admin/admins — listar todos los admins de la plataforma
  @Get('admins')
  listarAdmins() {
    return this.superAdminService.listarAdmins();
  }

  // PATCH /super-admin/admin/:id/estado — activar o desactivar un admin
  @Patch('admin/:id/estado')
  cambiarEstadoAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: boolean }, // Recibe true o false
  ) {
    return this.superAdminService.cambiarEstadoAdmin(id, body.activo);
  }
}