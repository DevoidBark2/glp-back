import { Controller, Get, Req } from '@nestjs/common'
import { IconsService } from './icons.service'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@Controller('icons')
export class IconsController {
	constructor(private readonly iconsService: IconsService) {}

	@Authorization()
	@Get()
	async getAllFrames(@Req() req: Request) {
		return await this.iconsService.findAllForUser(req['user'])
	}
}
