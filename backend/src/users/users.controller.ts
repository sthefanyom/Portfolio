import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Quando acessar GET /users
  // — iremos retornar todos os usuários (por enquanto)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
