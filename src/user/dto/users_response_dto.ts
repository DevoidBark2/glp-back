import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  is_active: boolean;
  @ApiProperty()
  @Expose()
  created_at: Date;
}
