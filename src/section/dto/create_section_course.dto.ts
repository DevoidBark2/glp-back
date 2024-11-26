import { ApiProperty } from '@nestjs/swagger';
import { CourseEntity } from '../../course/entity/course.entity';
import { ComponentTask } from '../../component-task/entity/component-task.entity';
import { MainSection } from '../entity/main-section.entity';

export class CreateSectionCourseDto {
  @ApiProperty({ type: 'string' })
  name: string;
  @ApiProperty({ type: 'string' })
  description: string;
  @ApiProperty({ type: CourseEntity })
  course: CourseEntity;
  @ApiProperty({ type: 'array' })
  components: ComponentTask[];
  @ApiProperty({ type: 'json' })
  externalLinks: string[];
  @ApiProperty({ type: 'json' })
  uploadFile: string[];
  @ApiProperty({type: "number"})
  parentSection: number
}
