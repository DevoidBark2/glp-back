import { Controller, Get, Req } from '@nestjs/common'
import { FramesService } from './frames.service'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@Controller('frames')
export class FramesController {
	constructor(private readonly framesService: FramesService) {}

	@Authorization()
	@Get()
	async getAllFrames(@Req() req: Request) {
		return await this.framesService.findAllForUser(req['user'])
	}
}
