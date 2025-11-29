import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Carrega variáveis do .env automaticamente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
