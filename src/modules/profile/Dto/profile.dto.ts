import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../profile.entity';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ProfileDto {
  constructor(profile?: Profile) {
    if (profile) {
      this.dikidiLink = profile.dikidiLink;
      this.igLink = profile.igLink;
      this.vkLink = profile.vkLink;
      this.tg = profile.tg;
      this.whatsApp = profile.whatsApp;
      this.phone = profile.phone;
    }
  }
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректная ссылка Instagram' })
  vkLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректная ссылка Instagram' })
  igLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректная ссылка Dikidi' })
  dikidiLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректная ссылка Telegram' })
  tg?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  whatsApp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
