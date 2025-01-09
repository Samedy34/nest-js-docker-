import {Controller, Post, UseGuards, Request, Get, Body} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthDto } from './auth/auth.local.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {AuthRefreshDto} from "./auth/auth.refresh.dto";
import {QrCodeLinkDto} from "./dto/qr-code-link.dto";
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('auth')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Authorization' })
  @ApiResponse({
    status: 200,
    description: 'The user was successfully retrieved.',
    type: Boolean,
  })
  @ApiBody({ type: AuthDto })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh token.',
  })
  @ApiBody({ type: AuthRefreshDto })
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req: any) {
    return req.logout();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'Get User.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@Request() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: 'Generate QR Code' })
  @ApiResponse({
    status: 200,
    description: 'Generated QR code in base64.',
  })
  @ApiBody({ type: QrCodeLinkDto })
  @Post('qrcode')
  async qrcode(@Body('link') link: string) {
    try {
      // Путь для сохранения файла
      const fileName = `${Date.now()}.png`;
      const filePath = path.join(__dirname, '../qrcodes', fileName);

      // Создаем папку, если ее нет
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      // Генерация и сохранение QR-кода
      await QRCode.toFile(filePath, link);

      // Формирование абсолютной ссылки
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const fileUrl = `${baseUrl}/qrcodes/${fileName}`;

      return { message: 'QR-код успешно создан', fileUrl };
    } catch (error) {
      throw new Error(`Ошибка генерации QR-кода: ${error.message}`);
    }
  }
}
