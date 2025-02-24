import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req
} from '@nestjs/common'
import { AchievementsService } from './achievements.service'
import { CreateAchievementDto } from './dto/create-achievement.dto'
import { UpdateAchievementDto } from './dto/update-achievement.dto'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { UserRole } from 'src/constants/contants'

@Controller('achievements')
export class AchievementsController {
	constructor(private readonly achievementsService: AchievementsService) { }

	@Post()
	create(@Body() createAchievementDto: CreateAchievementDto) {
		return this.achievementsService.create(createAchievementDto)
	}

	@Authorization()
	@Get()
	findAll(@Req() req: Request) {
		return this.achievementsService.findAll(req['user'])
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.achievementsService.findOne(+id)
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateAchievementDto: UpdateAchievementDto
	) {
		return this.achievementsService.update(+id, updateAchievementDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.achievementsService.remove(+id)
	}
}
