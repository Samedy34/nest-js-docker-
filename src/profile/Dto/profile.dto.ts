import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../profile.entity';

export class ProfileDto {
  constructor(profile: Profile) {
    this.dikidiLink = profile.dikidiLink;
    this.igLink = profile.igLink;
    this.vkLink = profile.vkLink;
    this.tg = profile.tg;
    this.whatsApp = profile.whatsApp;
    this.phone = profile.phone;
  }
  @ApiProperty({ required: false })
  vkLink?: string;

  @ApiProperty({ required: false })
  igLink?: string;

  @ApiProperty({ required: false })
  dikidiLink?: string;

  @ApiProperty({ required: false })
  tg?: string;

  @ApiProperty({ required: false })
  whatsApp?: string;

  @ApiProperty({ required: false })
  phone?: string;
}
