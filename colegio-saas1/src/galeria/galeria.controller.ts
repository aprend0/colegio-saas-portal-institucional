import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { GaleriaService } from './galeria.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('galeria')
export class GaleriaController {
  constructor(private readonly galeriaService: GaleriaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.galeriaService.findByColegioId(req.user.colegioId);
  }

  @Get('publico/:colegioId')
  findPublico(@Param('colegioId') colegioId: string) {
    return this.galeriaService.findByColegioId(+colegioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Carpeta física en la raíz del proyecto
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() body: any, 
    @Request() req: any
  ) {
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }

    // Ruta de la imagen que se guardará en la columna 'imagen' de Postgres
    const urlImagen = `/uploads/${file.filename}`;

    return this.galeriaService.create({
      titulo: body.titulo,
      imagen: urlImagen,
      categoria: body.categoria,
      colegioId: req.user.colegioId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/eliminar')
  eliminar(@Param('id') id: string) {
    return this.galeriaService.eliminar(+id);
  }
}
