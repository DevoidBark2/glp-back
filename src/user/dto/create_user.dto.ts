import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../constants/contants';

export class CreateUserDto {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  second_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  university: string;
  @ApiProperty({ default: false })
  is_active: boolean;
  @ApiProperty()
  birth_day: Date;
  @ApiProperty({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;
}
