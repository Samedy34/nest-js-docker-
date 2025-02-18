import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshDto {
  @ApiProperty()
  refresh_token: string;
}
