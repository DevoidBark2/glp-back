import { ApiProperty } from '@nestjs/swagger'

export class CreateCommentDto {
	@ApiProperty()
	sectionId: number
	@ApiProperty()
	comment: string
}
