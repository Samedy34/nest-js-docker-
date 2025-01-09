import { ApiProperty } from '@nestjs/swagger';

export class QrCodeLinkDto {
  @ApiProperty()
  link: string;
}
