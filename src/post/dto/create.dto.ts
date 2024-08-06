import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The name of the post' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'The image path associated with the post',
  })
  image: string;

  @ApiProperty({ description: 'The content of the post' })
  content: string;

  @ApiProperty({
    type: 'string', // Для Swagger лучше использовать 'string' с указанием формата
    format: 'date-time',
    description: 'The publish date of the post in format YYYY-MM-DD HH:mm',
  })
  @IsDate()
  publish_date: Date;
}
