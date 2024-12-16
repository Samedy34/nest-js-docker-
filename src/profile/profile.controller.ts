import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.entity';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthDto } from '../auth/auth.local.dto';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'The user was successfully retrieved.',
    type: Profile,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('getProfile')
  myProfile(@Request() request: any): Promise<Profile> {
    console.log(request);
    return this.profileService.getProfileByUser(request.user);
  }
}
