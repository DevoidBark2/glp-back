import { ApiProperty } from '@nestjs/swagger'

export class ChangeUserSettingsDto {
	@ApiProperty()
	id: number
	@ApiProperty()
	vertex_color: string
	@ApiProperty()
	edge_color: string
	@ApiProperty()
	type_vertex: string
	@ApiProperty()
	border_vertex: string
	@ApiProperty()
	enabled_grid: boolean
	@ApiProperty()
	background_color: string
}
