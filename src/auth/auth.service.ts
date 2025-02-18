import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Метод для проверки пользователя (например, при логине)
  async validateUser(phone: string, pass: string): Promise<User | null> {
    const user = await this.usersService.getUserByPhone(phone);

    if (!user) {
      return null; // Пользователь не найден
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return null; // Пароль неверный
    }

    return user;
  }

  // Метод для авторизации (логина)
  async login(user: User) {
    const payload = { username: user.phone, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  // Метод для обновления токенов с использованием refresh_token
  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // Проверка валидности refresh_token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      });

      const user = await this.usersService.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Генерация нового access_token и refresh_token
      const newAccessToken = this.jwtService.sign(
        { username: user.phone, sub: user.id },
        { expiresIn: '1h' }, // Срок жизни нового access_token
      );

      const newRefreshToken = this.generateRefreshToken(user);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  // Генерация refresh_token
  generateRefreshToken(user: User): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      expiresIn: '7d', // Срок жизни refresh_token
    });
  }
}
