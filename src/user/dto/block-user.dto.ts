import { ApiProperty } from '@nestjs/swagger'
import { StatusUserEnum } from '../enum/user-status.enum'

export class BlockUserDto {
	@ApiProperty()
	userId: string
	@ApiProperty()
	status: StatusUserEnum
}
