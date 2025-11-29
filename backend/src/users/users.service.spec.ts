import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  // Injeta o Model User do Mongoose
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // Cria um novo usuário com a senha já criptografada
  async createUser(
    name: string,
    email: string,
    password: string,
    isAdmin = false,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    return user.save();
  }

  // Busca usuário por e-mail
  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  // Busca por ID
  async findById(id: string) {
    return this.userModel.findById(id);
  }

  // Retorna todos os usuários (só admin usará isso no futuro)
  async findAll() {
    return this.userModel.find();
  }
}
