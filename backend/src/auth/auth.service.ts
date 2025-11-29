import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Valida email e senha
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email não encontrado');
    }

    // Compara senha fornecida com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Senha incorreta');
    }

    // Retorna o usuário sem a senha
    const { password: _, ...result } = user.toObject();
    return result;
  }

  // Gera um token JWT para o usuário
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    // Payload que ficará dentro do token
    const payload = {
      sub: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    // Retorna token + dados do usuário
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
