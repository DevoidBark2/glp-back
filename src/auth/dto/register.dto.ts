import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'
import { IsPasswordsMatchingConstraint } from '../../libs/common/decorators/is-passwords-matching-constraint.decorator'
import { IsOptional } from 'class-validator'

export class RegisterUserDto {
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
	@ApiProperty()
	first_name: string
	@IsOptional()
	@IsString({ message: 'Фамилия должна быть строкой.' })
	@ApiProperty()
	second_name: string
	@IsOptional()
	@IsString({ message: 'Отчество должно быть строкой.' })
	@ApiProperty()
	last_name: string
	@IsString({ message: 'Email должен быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email.' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения.' })
	email: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
	@MinLength(8, {
		message: 'Пароль должен содержать минимум 8 символов.'
	})
	password: string

	@IsString({ message: 'Пароль подтверждения должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
	@MinLength(8, {
		message: 'Пароль подтверждения должен содержать не менее 8 символов.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Пароли не совпадают.'
	})
	passwordRepeat: string
}
