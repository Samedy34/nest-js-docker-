import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileDto } from './Dto/profile.dto';
import { UserService } from '../user/user.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'The user was successfully retrieved.',
    type: ProfileDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async myProfile(@Request() request: any): Promise<ProfileDto> {
    const profile = await this.profileService.getProfileByUser(request.user);

    return new ProfileDto(profile);
  }

  @ApiOperation({ summary: 'Set profile' })
  @ApiResponse({
    status: 200,
    description: 'Set profile to user.',
    type: ProfileDto,
  })
  @ApiBearerAuth()
  @ApiBody({ type: ProfileDto })
  @UseGuards(JwtAuthGuard)
  @Put('setProfile')
  async setProfile(
    @Request() request: any,
    @Body() body: ProfileDto,
  ): Promise<ProfileDto> {
    const profile = await this.profileService.getProfileByUser(request.user);

    profile.vkLink = body.vkLink;
    profile.igLink = body.igLink;
    profile.dikidiLink = body.dikidiLink;
    profile.whatsApp = body.whatsApp;
    profile.tg = body.tg;
    profile.phone = body.phone;

    await this.profileService.saveProfile(profile);

    return new ProfileDto(profile);
  }

  @ApiOperation({ summary: 'Get profile by id' })
  @ApiResponse({
    status: 200,
    description: 'Profile',
    type: ProfileDto,
  })
  @Get('getByUserId/:userId')
  async getProfileByUserId(
    @Param('userId') userId: number,
  ): Promise<ProfileDto> {
    const user = await this.userService.getUserById(+userId);
    const profile = await this.profileService.getProfileByUser(user);

    return new ProfileDto(profile);
  }
}
