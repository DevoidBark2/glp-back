import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Achievement } from './entities/achievement.entity'
import { Repository } from 'typeorm'
import { AchievementUser } from './entities/achievement-users.entity'
import { User } from 'src/user/entity/user.entity'
import { ConditionTypeEnum } from './enums/condition_type.enum'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class AchievementsService {
	constructor(
		@InjectRepository(Achievement)
		private readonly achievementRepository: Repository<Achievement>,
		@InjectRepository(AchievementUser)
		private readonly achievementUserRepository: Repository<AchievementUser>,
		private readonly eventEmitter: EventEmitter2
	) {}

	async findAll(user: User) {
		const achievements = await this.achievementRepository.find()

		return await Promise.all(
			achievements.map(async achievement => {
				const achievementUser =
					await this.achievementUserRepository.findOne({
						where: {
							user: { id: user.id },
							achievement: { id: achievement.id }
						}
					})

				const progress = achievementUser ? achievementUser.progress : 0

				return {
					...achievement,
					progress,
					targetValue: achievement.targetValue
				}
			})
		)
	}

	async updateAchievementProgress(
		userId: string,
		condition: ConditionTypeEnum,
		progressIncrease: number
	) {
		const achievement = await this.achievementRepository.findOne({
			where: { condition }
		})

		if (!achievement) return

		let achievementUser = await this.achievementUserRepository.findOne({
			where: {
				user: { id: userId },
				achievement: { id: achievement.id }
			},
			relations: {
				user: true,
				achievement: true
			}
		})

		// Если достижение уже получено, ничего не делаем
		if (achievementUser?.completed) return

		if (!achievementUser) {
			achievementUser = this.achievementUserRepository.create({
				user: { id: userId } as User,
				achievement: achievement,
				progress: 0,
				completed: false
			})
		}

		// Обновляем прогресс
		achievementUser.progress =
			Number(achievementUser.progress) + progressIncrease

		if (achievementUser.progress >= achievement.targetValue) {
			achievementUser.progress = achievement.targetValue
			achievementUser.completed = true
			achievementUser.completedAt = new Date()

			this.eventEmitter.emit('achievement.completed', {
				userId,
				achievementTitle: achievement.title
			})
		}

		await this.achievementUserRepository.save(achievementUser)
	}
}
