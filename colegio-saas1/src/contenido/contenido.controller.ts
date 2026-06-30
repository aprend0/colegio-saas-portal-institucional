import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContenidoService } from './contenido.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contenido')
export class ContenidoController {
  constructor(private readonly contenidoService: ContenidoService) {}

  @Get('publico/:colegioId')
  findPublico(@Param('colegioId') colegioId: string) {
    return this.contenidoService.findPublico(+colegioId);
  }

  @Get('colegio/:colegioId')
  @UseGuards(JwtAuthGuard)
  findByColegioId(@Param('colegioId') colegioId: string) {
    return this.contenidoService.findByColegioId(+colegioId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() body: any, @Request() req: any, @UploadedFile() file: any) {
    const data = {
      ...body,
      colegioId: req.user.colegioId, // Ya es número por tu contexto de auth
      activo: true,
      imagen: file ? `/uploads/${file.filename}` : body.imagen // Maneja ambas opciones
    };
    return this.contenidoService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // <--- AÑADE ESTO AQUÍ TAMBIÉN
  update(
    @Param('id') id: string, 
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File // <--- AÑADE ESTO
  ) {
    // Si estás usando FormData en el frontend, el backend debe saber que puede llegar un archivo
    return this.contenidoService.update(+id, { ...body, file });
  }

  
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) 
  updatePatch(
    @Param('id') id: string, 
    @Body() body: any, 
    @UploadedFile() file: Express.Multer.File 
  ) {
    // Si se subió un archivo, lo puedes imprimir para debugear
    console.log("Archivo recibido:", file);
    return this.contenidoService.update(+id, body);
  }

  @Patch(':id/eliminar')
  @UseGuards(JwtAuthGuard)
  desactivar(@Param('id') id: string) {
    return this.contenidoService.desactivar(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  eliminar(@Param('id') id: string) {
    return this.contenidoService.eliminar(+id);
  }
}
