import { ApiProperty } from '@nestjs/swagger';

export class ResultLoginExampleDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  user_name: string;
  @ApiProperty()
  token: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: false })
  status: boolean;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty({ type: ResultLoginExampleDto })
  data: ResultLoginExampleDto;

  @ApiProperty()
  timestamp: Date;
}
