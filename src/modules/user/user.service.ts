import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.saltRounds = Number(this.configService.get('SALT_ROUNDS'));
  }

  async createUser(phone: string, password: string): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);

    const user = this.usersRepository.create({
      phone: phone,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async getUserByPhone(phone: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { phone: phone } });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return user;
  }
}
