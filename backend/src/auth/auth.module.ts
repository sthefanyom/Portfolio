import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Importa UsersModule para ter acesso ao UsersService
    UsersModule,

    // Passport: necessário para estratégia JWT
    PassportModule,

    // Configuração do JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key', // Troque em produção
      signOptions: { expiresIn: '1d' }, // Token dura 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Permite usar AuthService em outros módulos
})
export class AuthModule {}
