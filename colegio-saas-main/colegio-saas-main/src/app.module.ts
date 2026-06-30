import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { AuthModule } from './auth/auth.module';
import { ColegioModule } from './colegio/colegio.module';
import { ContenidoModule } from './contenido/contenido.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { DocentesModule } from './docentes/docentes.module';
import { GradosModule } from './grados/grados.module';
import { SeccionesModule } from './secciones/secciones.module';
import { CursosModule } from './cursos/cursos.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { NotasModule } from './notas/notas.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { PagosModule } from './pagos/pagos.module';
import { ReportesModule } from './reportes/reportes.module';
import { HorariosModule } from './horarios/horarios.module';
import { PanelColegioModule } from './panel-colegio/panel-colegio.module';
import { PortalEstudianteModule } from './portal-estudiante/portal-estudiante.module';
import { NoticiasEducacionModule } from './noticias-educacion/noticias-educacion.module';

@Module({
  imports: [PrismaModule, SuperAdminModule, AuthModule, ColegioModule, ContenidoModule, EstudiantesModule, DocentesModule, GradosModule, SeccionesModule, CursosModule, MatriculasModule, NotasModule, AsistenciasModule, PagosModule, ReportesModule, HorariosModule, PanelColegioModule, PortalEstudianteModule, NoticiasEducacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
