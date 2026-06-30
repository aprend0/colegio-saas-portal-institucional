import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';

// Módulo del Super Admin — gestiona los admins de los colegios
@Module({
  controllers: [SuperAdminController], // Controlador con las rutas del Super Admin
  providers: [SuperAdminService],      // Servicio con la lógica del Super Admin
  exports: [SuperAdminService],        // Exporta el servicio para otros módulos
})
export class SuperAdminModule {}