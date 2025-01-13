import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valide l'utilisateur en vérifiant l'email et le mot de passe.
   *
   * @param email - Email de l'utilisateur.
   * @param password - Mot de passe de l'utilisateur.
   * @returns L'objet utilisateur sans le mot de passe si les informations sont valides, sinon null.
   */

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }
  /**
   * Authentifie l'utilisateur et génère un token JWT.
   *
   * @param loginDto - Contient l'email et le mot de passe envoyés par le client.
   * @returns Un objet contenant un token JWT (access_token) et les informations de l'utilisateur.
   * @throws UnauthorizedException si les informations d'identification sont invalides.
   */

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
