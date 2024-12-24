import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@IsEmail({}, { message: 'Введите корректный email' })
	@IsNotEmpty({ message: 'Поле email не может быть пустым!' })
	email: string
}
