import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PostStatusEnum } from '../enum/PostStatus.enum';

export class ChangePostDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'The name of the post' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'file',
    description: 'The image path associated with the post',
    required: false,
  })
  image: string;

  @ApiProperty({ description: 'The content of the post', required: true })
  content: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({})
  status: PostStatusEnum;

  @ApiProperty({})
  is_publish: boolean;
}
