import { ApiProperty } from '@nestjs/swagger';

export class ResultExampleDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  message: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: false })
  status: boolean;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ type: ResultExampleDto })
  data: ResultExampleDto;

  @ApiProperty()
  timestamp: Date;
}
