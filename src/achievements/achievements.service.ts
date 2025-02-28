import { Injectable } from '@nestjs/common'
import { CreateAchievementDto } from './dto/create-achievement.dto'
import { UpdateAchievementDto } from './dto/update-achievement.dto'
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
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly eventEmitter: EventEmitter2
	) {

	}
	create(createAchievementDto: CreateAchievementDto) {
		return ""
	}

	async findAll(user: User) {
		const achievements = await this.achievementRepository.find();

		const achievementsWithProgress = await Promise.all(
			achievements.map(async (achievement) => {
				const achievementUser = await this.achievementUserRepository.findOne({
					where: { user: { id: user.id }, achievement: { id: achievement.id } },
				});

				const progress = achievementUser ? achievementUser.progress : 0;

				return {
					...achievement,
					progress,
					targetValue: achievement.targetValue,
				};
			}),
		);

		return achievementsWithProgress;
	}

	async updateAchievementProgress(userId: string, condition: ConditionTypeEnum, progressIncrease: number) {
		const achievement = await this.achievementRepository.findOne({ where: { condition } });

		if (!achievement) return;

		let achievementUser = await this.achievementUserRepository.findOne({
			where: { user: { id: userId }, achievement: { id: achievement.id } },
			relations: {
				user: true,
				achievement: true
			},
		});

		// Если достижение уже получено, ничего не делаем
		if (achievementUser?.completed) return;

		if (!achievementUser) {
			achievementUser = this.achievementUserRepository.create({
				user: { id: userId } as User,
				achievement: achievement,
				progress: 0,
				completed: false,
			});
		}

		// Обновляем прогресс
		achievementUser.progress = Number(achievementUser.progress) + progressIncrease;

		if (achievementUser.progress >= achievement.targetValue) {
			achievementUser.progress = achievement.targetValue;
			achievementUser.completed = true;
			achievementUser.completedAt = new Date();

			this.eventEmitter.emit('achievement.completed', {
				userId,
				achievementTitle: achievement.title,
			});
		}

		await this.achievementUserRepository.save(achievementUser);
	}

	findOne(id: number) {
		return `This action returns a #${id} achievement`
	}

	update(id: number, updateAchievementDto: UpdateAchievementDto) {
		return `This action updates a #${id} achievement`
	}

	remove(id: number) {
		return `This action removes a #${id} achievement`
	}
}
