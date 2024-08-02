import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionCourseDto {
  @ApiProperty({ type: 'string' })
  title: string;
  @ApiProperty({ type: 'number' })
  courseId: number;
}
