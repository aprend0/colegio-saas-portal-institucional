import { Module } from '@nestjs/common';
import { PanelColegioService } from './panel-colegio.service';
import { PanelColegioController } from './panel-colegio.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PanelColegioController],
  providers: [PanelColegioService],
})
export class PanelColegioModule {}
