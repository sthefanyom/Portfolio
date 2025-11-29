import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard ativa a estratégia JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
