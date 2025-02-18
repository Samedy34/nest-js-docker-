import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './Dto/user.create.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({
    status: 200,
    description: 'The user was successfully retrieved.',
    type: User,
  })
  @Post('register')
  @ApiBody({ type: UserCreateDto })
  async register(@Body() body: UserCreateDto): Promise<User> {
    return this.usersService.createUser(body.phone, body.password);
  }
}
