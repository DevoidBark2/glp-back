import { Controller, Get, Query, Req } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'

@ApiTags('Статистика')
@Controller()
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('global-search')
	async getGlobalSearch(@Query('text') text: string, @Req() req: Request) {
		return await this.statisticsService.globalSearch(text, req['user'])
	}

	@Authorization()
	@Get('statistics')
	async getStatistics(@Authorized('id') userId: string) {
		return await this.statisticsService.getStatistics(userId)
	}
}
