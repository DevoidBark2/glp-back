import { Controller, Get, Req } from '@nestjs/common'
import { AchievementsService } from './achievements.service'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@Controller('achievements')
export class AchievementsController {
	constructor(private readonly achievementsService: AchievementsService) {}
	@Authorization()
	@Get()
	findAll(@Req() req: Request) {
		return this.achievementsService.findAll(req['user'])
	}
}
