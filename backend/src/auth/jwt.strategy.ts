import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // De onde o token será lido
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      // Mesma chave usada para assinar o token
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
    });
  }

  // O retorno aqui vira req.user nas rotas protegidas
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  }
}
