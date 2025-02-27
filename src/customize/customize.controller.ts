import { Body, Controller, Post, Req } from '@nestjs/common'
import { CustomizeService } from './customize.service'
import { BuyItemDto } from './dto/buy-item.dto'
import { Authorization } from '../auth/decorators/auth.decorator'

@Controller('customize')
export class CustomizeController {
	constructor(private readonly customizeService: CustomizeService) {}

	@Authorization()
	@Post('/buy')
	async buyItem(@Req() req: Request, @Body() body: BuyItemDto) {
		return this.customizeService.buyItem(req['user'], body)
	}

	@Authorization()
	@Post('/selected')
	async selectedCustomizeItem(@Req() req: Request, @Body() body: BuyItemDto) {
		return this.customizeService.selectedCustomizeItem(req['user'], body)
	}
}
