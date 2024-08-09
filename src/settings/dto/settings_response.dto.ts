import { ApiProperty } from '@nestjs/swagger';

export class UserSettingResponseDataDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  vertex_color: string;
  @ApiProperty()
  edge_color: string;
  @ApiProperty()
  type_vertex: string;
  @ApiProperty()
  border_vertex: string;
  @ApiProperty()
  enabled_grid: boolean;
  @ApiProperty()
  background_color: string;
}

export class SettingsResponseDto {
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  path: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  data: UserSettingResponseDataDto;
  @ApiProperty()
  timestamp: Date;
}
