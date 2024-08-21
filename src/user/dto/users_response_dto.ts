import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StatusUserEnum } from '../enum/user-status.enum';

export class UsersResponseDto {
  @ApiProperty()
  @Expose()
  id: number;
  @ApiProperty()
  @Expose()
  first_name: string;
  @ApiProperty()
  @Expose()
  second_name: string;
  @ApiProperty()
  @Expose()
  last_name: string;
  @ApiProperty()
  @Expose()
  role: string;
  @ApiProperty()
  @Expose()
  email: string;
  @ApiProperty()
  @Expose()
  status: StatusUserEnum;
  @ApiProperty()
  @Expose()
  created_at: Date;
}
