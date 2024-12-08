import { ApiProperty } from '@nestjs/swagger';

export class MainSectionDto {
  @ApiProperty()
  title: string;
}
