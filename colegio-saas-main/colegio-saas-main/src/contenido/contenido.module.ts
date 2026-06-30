import { Module } from '@nestjs/common';
import { ContenidoService } from './contenido.service';
import { ContenidoController } from './contenido.controller';

// Módulo de contenido — gestiona comunicados, noticias, eventos y aniversarios
@Module({
  controllers: [ContenidoController], // Controlador con las rutas de contenido
  providers: [ContenidoService],      // Servicio con la lógica de contenido
  exports: [ContenidoService],        // Exporta el servicio para otros módulos
})
export class ContenidoModule {}