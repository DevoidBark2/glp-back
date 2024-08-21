import { ApiProperty } from '@nestjs/swagger';
import { StatusUserEnum } from '../enum/user-status.enum';

export class GlobalActionDto {
  @ApiProperty()
  action: StatusUserEnum;
  @ApiProperty()
  usersIds: number[];
}
