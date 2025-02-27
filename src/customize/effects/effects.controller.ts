import { Controller, Get, Req } from '@nestjs/common'
import { EffectsService } from './effects.service'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@Controller('effects')
export class EffectsController {
	constructor(private readonly effectsService: EffectsService) {}

	@Authorization()
	@Get()
	async getAllEffects(@Req() req: Request) {
		return await this.effectsService.findAllForUser(req['user'])
	}
}
