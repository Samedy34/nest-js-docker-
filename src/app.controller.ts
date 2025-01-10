import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from './auth/auth.local.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthRefreshDto } from './auth/auth.refresh.dto';
import { QrCodeLinkDto } from './dto/qr-code-link.dto';
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
  @ApiOperation({ summary: 'Get user', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'Get User.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@Request() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: 'Generate QR Code', tags: ['services'] })
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

  @ApiOperation({ summary: 'Generate Card', tags: ['services'] })
  @ApiResponse({
    status: 200,
    description: 'Generate business card and return file URL',
  })
  @Get('cards')
  async getCard(): Promise<{ url: string }> {
    try {
      const templatePath = path.join(__dirname, '../template.svg');

      // Чтение SVG-шаблона
      let svgTemplate = fs.readFileSync(templatePath, 'utf8');

      // Генерация QR-кода в формате SVG
      const qrCodeSvg = await QRCode.toString('https://example.com/contact', {
        type: 'svg',
      });

      // Замена плейсхолдеров
      svgTemplate = svgTemplate
        .replace('{{name}}', 'John Doe')
        .replace('{{jobTitle}}', 'Software Developer')
        .replace('{{phone}}', '+1 123-456-7890')
        .replace('{{email}}', 'johndoe@example.com')
        .replace('{{qrcode}}', qrCodeSvg);

      // Директория для сохранения карты
      const cardsDir = path.join(__dirname, '../cards');
      if (!fs.existsSync(cardsDir)) {
        fs.mkdirSync(cardsDir, { recursive: true });
      }

      // Имя и путь файла
      const fileName = `${Date.now()}.svg`;
      const filePath = path.join(cardsDir, fileName);

      // Сохранение SVG на диск
      fs.writeFileSync(filePath, svgTemplate);

      // Возвращение ссылки
      const baseUrl = 'http://localhost:3000/cards'; // Замените на ваш реальный URL
      const fileUrl = `${baseUrl}/${fileName}`;

      return { url: fileUrl };
    } catch (error) {
      console.error('Ошибка при создании визитки:', error);
      throw new Error('Не удалось создать визитку');
    }
  }
}
