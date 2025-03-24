import { ApiProperty } from '@nestjs/swagger'
import { ComponentTask } from '../../component-task/entity/component-task.entity'

export class ChangeExamDto {
	@ApiProperty()
	title: string
	@ApiProperty()
	components: ComponentTask[]
}
