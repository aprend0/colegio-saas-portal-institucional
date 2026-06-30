import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard JWT — protege las rutas que requieren autenticación
// Se usa como decorador @UseGuards(JwtAuthGuard) en los controladores
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}