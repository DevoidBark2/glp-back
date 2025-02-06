import { ApiProperty } from '@nestjs/swagger'

export class ChangeComponentOrderDto {
	@ApiProperty()
	sectionId: number
	@ApiProperty()
	components: { id: number; sort: number }[]
}
