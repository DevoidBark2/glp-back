import { ApiProperty } from '@nestjs/swagger'

export class SubscribeCourseDto {
	@ApiProperty()
	courseId: number
	@ApiProperty()
	userId: string
}
