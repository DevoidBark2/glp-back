import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, Min } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  second_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  university: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 2,
      minSymbols: 2,
      minNumbers: 1,
      minLowercase: 2,
    },
    { message: 'Пароль должен быть сложнее,попробуйте еще раз!' },
  )
  password: string;
  @ApiProperty()
  birth_day: Date;
}
