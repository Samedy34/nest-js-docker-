import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Метод для создания пользователя
  async createUser(phone: string, password: string): Promise<User> {
    const user = this.usersRepository.create({
      phone,
      password,
    });

    return this.usersRepository.save(user);
  }
}
