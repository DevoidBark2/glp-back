import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from 'src/constants/contants'

export class ChangeUserRoleDto {
	@ApiProperty()
	userId: string
	@ApiProperty()
	role: UserRole
}
