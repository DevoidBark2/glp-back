import { ApiProperty } from '@nestjs/swagger'
import { CourseEntity } from '../../course/entity/course.entity'
import { ComponentTask } from '../../component-task/entity/component-task.entity'
export type FileType = {
	filePath: string
	fileName: string
}
export class ChangeSectionCourseDto {
	@ApiProperty({ type: 'number' })
	id: number
	@ApiProperty({ type: 'string' })
	name: string
	@ApiProperty({ type: 'string' })
	description: string
	@ApiProperty()
	course: CourseEntity
	@ApiProperty({ type: 'string' })
	components: ComponentTask[]
	@ApiProperty({ type: 'json' })
	externalLinks: string[]
	@ApiProperty({ type: 'json' })
	uploadFile: FileType[]
	@ApiProperty({ type: 'number' })
	parentSection: number
}
