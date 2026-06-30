import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { AuthModule } from './auth/auth.module';
import { ColegioModule } from './colegio/colegio.module';
import { ContenidoModule } from './contenido/contenido.module';
import { GaleriaModule } from './galeria/galeria.module';

@Module({
  imports: [PrismaModule, SuperAdminModule, AuthModule, ColegioModule, ContenidoModule, GaleriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
