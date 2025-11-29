// Importa os decorators e tipos do Mongoose dentro do NestJS
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define que o UserModel será um documento do MongoDB
export type UserDocument = User & Document;

// O decorator @Schema transforma a classe em uma entidade do banco
@Schema({ timestamps: true }) // timestamps cria automaticamente createdAt e updatedAt
export class User {

  // Nome do usuário (obrigatório)
  @Prop({ required: true })
  name: string;

  // Email do usuário
  @Prop({ required: true, unique: true }) // unique impede emails duplicados
  email: string;

  // Senha criptografada (nunca guardamos senha "pura")
  @Prop({ required: true })
  password: string;

  // Define se o usuário é admin
  @Prop({ default: false })
  isAdmin: boolean;
}

// Transforma a classe numa Schema compreendida pelo Mongoose
export const UserSchema = SchemaFactory.createForClass(User);
