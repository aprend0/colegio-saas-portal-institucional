import { Module } from '@nestjs/common';
import { PortalEstudianteService } from './portal-estudiante.service';
import { PortalEstudianteController } from './portal-estudiante.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PortalEstudianteController],
  providers: [PortalEstudianteService],
})
export class PortalEstudianteModule {}
