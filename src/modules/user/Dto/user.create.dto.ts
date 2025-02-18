import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}
