import { ApiProperty } from '@nestjs/swagger'

export class CreateAvatarIconDto {
	@ApiProperty()
	image: string
}
