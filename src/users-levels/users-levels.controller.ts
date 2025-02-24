import { Controller, Get } from '@nestjs/common'
import { UsersLevelsService } from './users-levels.service'

@Controller('users-levels')
export class UsersLevelsController {
	constructor(private readonly usersLevelsService: UsersLevelsService) {}

	@Get('')
	async getUsersLevels() {
		return await this.usersLevelsService.getUsersLevels()
	}
}
