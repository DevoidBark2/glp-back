import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ type: 'file' })
  image: string;
  @ApiProperty()
  content: string;
  @ApiProperty({
    type: 'date',
    format: 'YYYY-MM-DD HH:mm',
  })
  @IsDate()
  publish_date: Date;
}
