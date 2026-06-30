import { Controller, Get, Post, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ColegioService } from './colegio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Controlador de colegios — define las rutas del módulo colegio
// @UseGuards(JwtAuthGuard) protege todas las rutas con autenticación JWT
@Controller('colegio')
@UseGuards(JwtAuthGuard)
export class ColegioController {
  constructor(
    private colegioService: ColegioService, // Inyección del servicio de colegios
  ) {}

  // GET /colegio — obtener lista de todos los colegios
  @Get()
  listarTodos() {
    return this.colegioService.listarTodos();
  }

  // GET /colegio/:id — obtener un colegio por su ID
  @Get(':id')
  obtenerPorId(
    @Param('id', ParseIntPipe) id: number, // Convierte el parámetro a número
  ) {
    return this.colegioService.obtenerPorId(id);
  }

  // POST /colegio — crear un nuevo colegio
  @Post()
  crear(
    @Body() body: { nombre: string }, // Recibe el nombre del colegio
  ) {
    return this.colegioService.crear(body.nombre);
  }

  // PATCH /colegio/:id/estado — activar o desactivar un colegio
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: boolean }, // Recibe true o false
  ) {
    return this.colegioService.cambiarEstado(id, body.activo);
  }

  // PATCH /colegio/:id — actualizar datos del colegio
  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      nombre?: string;
      logo?: string;
      colorPrimario?: string;
      colorSecundario?: string;
    },
  ) {
    return this.colegioService.actualizar(id, body);
  }
}