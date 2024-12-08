import { ApiProperty } from '@nestjs/swagger';
import { PostStatusEnum } from '../enum/PostStatus.enum';

export class UpdatePostStatus {
  @ApiProperty()
  postId: number;
  @ApiProperty()
  status: PostStatusEnum;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  comments: string[];
}
