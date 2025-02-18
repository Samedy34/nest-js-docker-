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

  async validateUser(phone: string, pass: string): Promise<User | null> {
    const user = await this.usersService.getUserByPhone(phone);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = { username: user.phone, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user),
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

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

  generateRefreshToken(user: User): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
      expiresIn: '7d', // Срок жизни refresh_token
    });
  }
}
