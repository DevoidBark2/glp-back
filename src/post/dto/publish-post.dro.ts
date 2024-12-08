import { ApiProperty } from '@nestjs/swagger';

export class PublishPostDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  checked: boolean;
}
