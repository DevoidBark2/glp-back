import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AchievementsService } from 'src/achievements/achievements.service'
import { ConditionTypeEnum } from 'src/achievements/enums/condition_type.enum'
import { UserLevel } from 'src/users-levels/entity/user-level.entity'
import { UserLevelEnum } from 'src/users-levels/enums/user-level.enum'
import { Repository } from 'typeorm'

@Injectable()
export class XpService {
	constructor(
		@InjectRepository(UserLevel)
		private readonly userLevelRepository: Repository<UserLevel>,
		private readonly achievementsService: AchievementsService
	) {}

	async updateXpForUser(userId: string, xp: number) {
		const userLevel = await this.userLevelRepository.findOne({
			where: { user: { id: userId } }
		})

		if (!userLevel) {
			throw new Error('User level data not found')
		}

		// Обновляем очки
		const newPoints = userLevel.points + xp

		// Определяем новый уровень
		let newLevel: UserLevelEnum

		if (newPoints >= 4501) newLevel = UserLevelEnum.Immortal
		else if (newPoints >= 3601) newLevel = UserLevelEnum.Legend
		else if (newPoints >= 2801) newLevel = UserLevelEnum.Grandmaster
		else if (newPoints >= 2101) newLevel = UserLevelEnum.Master
		else if (newPoints >= 1501) newLevel = UserLevelEnum.Expert
		else if (newPoints >= 1001) newLevel = UserLevelEnum.Advanced
		else if (newPoints >= 601) newLevel = UserLevelEnum.Skilled
		else if (newPoints >= 301) newLevel = UserLevelEnum.Learner
		else if (newPoints >= 101) newLevel = UserLevelEnum.Novice
		else newLevel = UserLevelEnum.Beginner

		// Сохраняем обновленные данные
		await this.userLevelRepository.update(userLevel.id, {
			points: newPoints,
			level: newLevel
		})

		await this.achievementsService.updateAchievementProgress(
			userId,
			ConditionTypeEnum.EARN_POINTS,
			xp
		)
		return { newPoints, newLevel }
	}
}
