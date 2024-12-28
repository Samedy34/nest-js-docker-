import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  constructor(vkLink?: string| null, igLink?: string | null) {
    this.vkLink = vkLink;
    this.igLink = igLink;
  }
  @ApiProperty()
  vkLink: string;

  @ApiProperty()
  igLink: string;
}
