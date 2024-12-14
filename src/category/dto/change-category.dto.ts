import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ChangeCategoryDto {
	@IsInt({ message: 'Значение должно быть число!' })
	@IsPositive({ message: 'Значение должно быть больше 0!' })
	@Type(() => Number)
	@ApiProperty({ type: 'number' })
	id: number

	@IsNotEmpty({ message: 'Название не должно быть пустым!' })
	@ApiProperty({ type: 'string' })
	name: string
}
