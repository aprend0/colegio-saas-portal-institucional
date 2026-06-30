import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ContenidoService } from './contenido.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Controlador de contenido — define las rutas para gestionar contenido del colegio
@Controller('contenido')
export class ContenidoController {
  constructor(
    private contenidoService: ContenidoService, // Inyección del servicio
  ) {}

  // POST /contenido — crear nuevo contenido (requiere autenticación)
  @Post()
  @UseGuards(JwtAuthGuard)
  crear(
    @Body() body: {
      tipo: string;
      titulo: string;
      descripcion: string;
      imagen?: string;
      colegioId: number;
    },
    @Request() req, // Obtener datos del usuario autenticado
  ) {
    return this.contenidoService.crear(body);
  }

  // GET /contenido/colegio/:colegioId — listar contenido de un colegio (requiere auth)
  @Get('colegio/:colegioId')
  @UseGuards(JwtAuthGuard)
  listarPorColegio(
    @Param('colegioId', ParseIntPipe) colegioId: number,
  ) {
    return this.contenidoService.listarPorColegio(colegioId);
  }

  // GET /contenido/colegio/:colegioId/tipo/:tipo — listar por tipo (requiere auth)
  @Get('colegio/:colegioId/tipo/:tipo')
  @UseGuards(JwtAuthGuard)
  listarPorTipo(
    @Param('colegioId', ParseIntPipe) colegioId: number,
    @Param('tipo') tipo: string,
  ) {
    return this.contenidoService.listarPorTipo(colegioId, tipo);
  }

  // GET /contenido/publico/:colegioId — listar contenido público (sin autenticación)
  @Get('publico/:colegioId')
  listarPublico(
    @Param('colegioId', ParseIntPipe) colegioId: number,
  ) {
    return this.contenidoService.listarPublico(colegioId);
  }

  // PATCH /contenido/:id — actualizar contenido (requiere auth)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      titulo?: string;
      descripcion?: string;
      imagen?: string;
      activo?: boolean;
    },
  ) {
    return this.contenidoService.actualizar(id, body);
  }

  // PATCH /contenido/:id/eliminar — desactivar contenido (requiere auth)
  @Patch(':id/eliminar')
  @UseGuards(JwtAuthGuard)
  eliminar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contenidoService.eliminar(id);
  }
}