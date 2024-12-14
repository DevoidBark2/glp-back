import { ApiProperty } from '@nestjs/swagger'

export class CreateBannerDto {
	@ApiProperty()
	name: string
	@ApiProperty()
	image: string
	@ApiProperty()
	description: string
	@ApiProperty()
	content: string
}
