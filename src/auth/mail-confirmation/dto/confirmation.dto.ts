import { IsNotEmpty, IsString } from 'class-validator'

export class ConfirmationDTO {
	@IsString({ message: 'токен должен быть строкой' })
	@IsNotEmpty({ message: 'Поле токен не может быть пустым' })
	token: string
}
