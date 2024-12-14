import { Controller, Get } from '@nestjs/common'
import { EventsService } from './events.service'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'

@ApiTags('События')
@Controller()
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('events')
	async getAll() {
		return await this.eventsService.getAll()
	}
}
