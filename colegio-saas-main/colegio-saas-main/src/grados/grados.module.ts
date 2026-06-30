import { Module } from '@nestjs/common';
import { GradosService } from './grados.service';
import { GradosController } from './grados.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GradosController],
  providers: [GradosService],
})
export class GradosModule {}
