import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../constants/contants'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	first_name: string
	@ApiProperty()
	@IsNotEmpty()
	second_name: string
	@ApiProperty()
	last_name: string
	@ApiProperty()
	@IsNotEmpty({ message: 'Required field' })
	email: string
	@ApiProperty()
	@IsNotEmpty()
	password: string
	@ApiProperty()
	@IsNotEmpty()
	city: string
	@ApiProperty()
	@IsNotEmpty()
	university: string
	@ApiProperty({ default: false })
	is_active: boolean
	@ApiProperty()
	@IsNotEmpty()
	birth_day: Date
	@ApiProperty({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
	@IsNotEmpty()
	role: UserRole
}
