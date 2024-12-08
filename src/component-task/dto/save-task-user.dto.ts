import { ApiProperty } from '@nestjs/swagger';
import { ComponentTask } from '../entity/component-task.entity';

export class SaveTaskUserDto {
  @ApiProperty()
  task: ComponentTask;
  @ApiProperty()
  answers: number[];
  @ApiProperty()
  currentSection: number;
}
