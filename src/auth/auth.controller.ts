import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint : Login utilisateur
   * Méthode : POST
   * URL : /auth/login
   * Description : Authentifie un utilisateur en validant ses informations d'identification (email et mot de passe).
   * Paramètres :
   * - loginDto : Contient l'email et le mot de passe envoyés par le client.
   * Retourne : Un token JWT (access_token) et des informations sur l'utilisateur.
   */

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
