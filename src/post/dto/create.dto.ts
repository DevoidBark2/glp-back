import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
}
