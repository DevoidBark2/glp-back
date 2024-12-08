import { ApiProperty } from '@nestjs/swagger';
import { StatusUserEnum } from '../enum/user-status.enum';

export class BlockUserDto {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  status: StatusUserEnum;
}
