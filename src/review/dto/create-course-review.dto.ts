import { ApiProperty } from '@nestjs/swagger'

class CreateCourseReviewDto {
	@ApiProperty()
	rating: number
	@ApiProperty()
	review: string
	@ApiProperty()
	courseId: number
}

export default CreateCourseReviewDto
