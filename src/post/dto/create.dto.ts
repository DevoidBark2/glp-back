import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The name of the post' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'file',
    description: 'The image path associated with the post',
    required: false
  })
  image: string;

  @ApiProperty({ description: 'The content of the post', required: true })
  content: string;

  @ApiProperty({ required: false })
  description: string;
}
