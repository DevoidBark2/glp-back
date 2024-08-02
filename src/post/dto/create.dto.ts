import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: 'file' })
  image: string;
  @ApiProperty()
  content: string;

  @ApiProperty({
    type: 'date',
    format: 'YYYY-MM-DD HH:mm',
  })
  publish_date: Date;
}
