import { Module } from '@nestjs/common'
import { AchievementsService } from './achievements.service'
import { AchievementsController } from './achievements.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Achievement } from './entities/achievement.entity'
import { User } from 'src/user/entity/user.entity'
import { AchievementUser } from './entities/achievement-users.entity'
import { UserModule } from 'src/user/user.module'
import { AchievementsListener } from './achievements.listener'

@Module({
	imports: [
		TypeOrmModule.forFeature([Achievement, User, AchievementUser]),
		UserModule
	],
	controllers: [AchievementsController],
	providers: [AchievementsService, AchievementsListener]
})
export class AchievementsModule {}
