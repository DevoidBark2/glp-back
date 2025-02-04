import { ApiProperty } from '@nestjs/swagger'
import { CourseComponentType } from '../enum/course-component-type.enum'
import { QuestionsType } from '../entity/component-task.entity'

export class CreateComponentTaskDto {
	@ApiProperty()
	id: string
	@ApiProperty()
	title: string
	@ApiProperty()
	description: string
	@ApiProperty()
	type: CourseComponentType
	@ApiProperty()
	questions: QuestionsType[]
	@ApiProperty()
	content_description: string
}
