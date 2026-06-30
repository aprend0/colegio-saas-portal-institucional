import { Module } from '@nestjs/common';
import { SeccionesService } from './secciones.service';
import { SeccionesController } from './secciones.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeccionesController],
  providers: [SeccionesService],
})
export class SeccionesModule {}
