import { ApiProperty } from '@nestjs/swagger'
export type FileType = {
	filePath: string
	fileName: string
}
export class CreateSectionCourseDto {
	@ApiProperty({ type: 'string' })
	name: string
	@ApiProperty({ type: 'string' })
	description: string
	@ApiProperty({ type: 'number' })
	course: number
	@ApiProperty({ type: 'string' })
	components: string
	@ApiProperty({ type: 'json' })
	externalLinks: string[]
	@ApiProperty({ type: 'json' })
	uploadFile: FileType[]
	@ApiProperty({ type: 'number' })
	parentSection: number
}
