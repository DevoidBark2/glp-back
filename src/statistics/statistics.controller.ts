import { Controller, Get, Query, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';

@ApiTags('Статистика')
@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('global-search')
  async getGlobalSearch(@Query('text') text: string, @Req() req: Request) {
    return await this.statisticsService.globalSearch(text, req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('statistics')
  async getStatistics(@Req() req: Request) {
    return await this.statisticsService.getStatistics(req['user']);
  }
}
