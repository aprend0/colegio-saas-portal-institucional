import { Module } from '@nestjs/common';
import { ColegioService } from './colegio.service';
import { ColegioController } from './colegio.controller';

// Módulo de colegios — gestiona todos los colegios de la plataforma SaaS
@Module({
  controllers: [ColegioController], // Controlador con las rutas de colegios
  providers: [ColegioService],      // Servicio con la lógica de colegios
  exports: [ColegioService],        // Exporta el servicio para otros módulos
})
export class ColegioModule {}