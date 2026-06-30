import { Module } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';

@Module({
  providers: [MatriculasService],
  controllers: [MatriculasController]
})
export class MatriculasModule {}
