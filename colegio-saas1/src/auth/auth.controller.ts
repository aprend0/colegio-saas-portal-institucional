import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// Controlador de autenticación — define las rutas del módulo auth
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, // Inyección del servicio de autenticación
  ) {}

  // Ruta POST /auth/login/super-admin — login del Super Admin
  @Post('login/super-admin')
  async loginSuperAdmin(
    @Body() body: { email: string; password: string },
  ) {
    // Llama al servicio de autenticación y retorna el token JWT
    return this.authService.loginSuperAdmin(body.email, body.password);
  }

  // Ruta POST /auth/login/admin — login del Admin del colegio
  @Post('login/admin')
  async loginAdmin(
    @Body() body: { email: string; password: string },
  ) {
    // Llama al servicio y retorna el token JWT con datos del colegio
    return this.authService.loginAdmin(body.email, body.password);
  }
}