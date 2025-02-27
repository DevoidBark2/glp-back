import { ApiProperty } from '@nestjs/swagger'
import { Icon } from '../icons/entity/icons.entity'
import { Effect } from '../effects/entity/effects.entity'
import { Frame } from '../frames/entity/frames.entity'

export class BuyItemDto {
	@ApiProperty()
	category: 'frames' | 'icons' | 'effects'

	@ApiProperty()
	item: Partial<Icon | Effect | Frame>
}
