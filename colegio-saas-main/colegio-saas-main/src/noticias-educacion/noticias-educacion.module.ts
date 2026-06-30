import { Module } from '@nestjs/common';
import { NoticiasEducacionService } from './noticias-educacion.service';
import { NoticiasEducacionController } from './noticias-educacion.controller';

@Module({
  providers: [NoticiasEducacionService],
  controllers: [NoticiasEducacionController]
})
export class NoticiasEducacionModule {}
