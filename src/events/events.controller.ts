import { Controller, Get } from '@nestjs/common'
import { EventsService } from './events.service'
import { ApiTags } from '@nestjs/swagger'
import { UserRole } from '../constants/contants'
import { Authorization } from '../auth/decorators/auth.decorator'

@ApiTags('События')
@Controller()
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Authorization(UserRole.SUPER_ADMIN)
	@Get('events')
	async getAll() {
		return await this.eventsService.getAll()
	}
}
