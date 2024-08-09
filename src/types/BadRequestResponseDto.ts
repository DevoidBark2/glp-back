import { ApiProperty } from '@nestjs/swagger';

class ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}

class ResultDto {
  @ApiProperty({ type: ErrorResponseDto })
  response: ErrorResponseDto;

  @ApiProperty()
  status: number;

  @ApiProperty()
  options: Record<string, unknown>;

  @ApiProperty()
  message: string;

  @ApiProperty()
  name: string;
}

// Main DTO for the entire error response
export class BadRequestResponseDto {
  @ApiProperty({ example: false })
  status: boolean;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ type: ResultDto })
  data: ResultDto;

  @ApiProperty()
  timestamp: Date;
}
