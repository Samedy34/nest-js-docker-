import {Controller, Post, UseGuards, Request, Get, Body} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthDto } from './auth/auth.local.dto';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {AuthRefreshDto} from "./auth/auth.refresh.dto";

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
}
