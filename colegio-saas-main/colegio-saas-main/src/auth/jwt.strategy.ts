import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Estrategia JWT — valida el token en cada petición protegida
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No permite tokens expirados
      ignoreExpiration: false,

      // Clave secreta para verificar la firma del token
      secretOrKey: process.env.JWT_SECRET || 'secreto_colegio_saas',
    });
  }

  // Método que se ejecuta después de validar el token
  // Retorna los datos del usuario que estarán disponibles en los controladores
  async validate(payload: any) {
    return {
      id: payload.sub,        // ID del usuario
      email: payload.email,   // Email del usuario
      rol: payload.rol,       // Rol del usuario (super-admin, admin)
    };
  }
}