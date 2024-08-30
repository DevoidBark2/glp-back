import { ApiProperty } from '@nestjs/swagger';
import { StatusCourseEnum } from '../enum/status_course.enum';

export class ChangeCourseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  small_description: string;
  @ApiProperty({ type: 'file' })
  image: string;
  @ApiProperty({ type: 'number' })
  category: number;
  @ApiProperty({ type: 'number' })
  access_right: number;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  level: number;
  @ApiProperty({
    type: 'date',
    format: 'YYYY-MM-DD HH:mm',
  })
  publish_date: Date;
  @ApiProperty()
  content_description: string;
  @ApiProperty()
  secret_key: string;
  @ApiProperty()
  status: StatusCourseEnum;
}
