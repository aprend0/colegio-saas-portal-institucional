import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard'; // Importación del guard JWT

// Módulo de autenticación — configura JWT y Passport para proteger rutas
@Module({
  imports: [
    // Configura el módulo de Passport con JWT como estrategia por defecto
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configura el módulo JWT con la clave secreta y tiempo de expiración
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto_colegio_saas', // Clave secreta
      signOptions: { expiresIn: '24h' },                         // Expira en 24 horas
    }),
  ],
  controllers: [AuthController],  // Controlador con las rutas de autenticación
  providers: [
    AuthService,   // Servicio con la lógica de autenticación
    JwtStrategy,   // Estrategia JWT para validar tokens
    JwtAuthGuard,  // Guard para proteger rutas
  ],
  exports: [
    AuthService,   // Exporta el servicio para usarlo en otros módulos
    JwtAuthGuard,  // Exporta el guard para proteger rutas en otros módulos
  ],
})
export class AuthModule {}