import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

// Типы фильтров
export enum FilterType {
	LEVEL = 'level',
	LESS = 'less',
	RANGE = 'range',
	GREATER = 'greater',
	SORT = 'sort'
}

class FilterOptionDto {
	@ApiProperty({ enum: FilterType, description: 'Тип фильтра' })
	@IsEnum(FilterType)
	type: FilterType

	@ApiProperty({
		oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'object' }]
	})
	@IsOptional()
	@IsString()
	@IsInt()
	value: string | number | { min: number; max: number }

	@ApiProperty({ description: 'Отображаемый текст фильтра' })
	@IsString()
	label: string
}

export class FilterValuesDto {
	@ApiProperty()
	searchString: string
	@ApiProperty({
		type: [Number],
		description: 'Список выбранных категорий (по ID)',
		example: [1, 2, 3]
	})
	categories: number[]

	@ApiProperty({
		type: [FilterOptionDto],
		description: 'Список выбранных уровней сложности',
		example: [{ type: 'level', value: 'beginner', label: 'Начинающий' }]
	})
	levels: FilterOptionDto[]

	@ApiProperty({
		type: [FilterOptionDto],
		description: 'Список выбранных продолжительностей',
		example: [
			{ type: 'less', value: 5, label: 'До 5 часов' },
			{ type: 'range', value: { min: 5, max: 10 }, label: '5-10 часов' }
		]
	})
	durations: FilterOptionDto[]

	@ApiProperty({
		type: FilterOptionDto,
		description: 'Выбранный вариант сортировки',
		example: {
			type: 'sort',
			value: 'popularity',
			label: 'По популярности'
		},
		required: false
	})
	sortOption: FilterOptionDto | null
}
