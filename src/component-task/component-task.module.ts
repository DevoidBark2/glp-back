import { Module } from '@nestjs/common'
import { ComponentTaskService } from './component-task.service'
import { ComponentTaskController } from './component-task.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComponentTask } from './entity/component-task.entity'
import { AnswersComponentUser } from './entity/component-task-user.entity'
import { SectionEntity } from 'src/section/entity/section.entity'
import { CourseUser } from 'src/course/entity/course-user.entity'
import { UserService } from 'src/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/entity/user.entity'
import { ComponentTaskListener } from './component-task.listener'
import { CoinsService } from 'src/coins/coins.service'
import { XpService } from 'src/xp/xp.service'
import { UserLevel } from 'src/users-levels/entity/user-level.entity'
import { AchievementsService } from 'src/achievements/achievements.service'
import { Achievement } from 'src/achievements/entities/achievement.entity'
import { AchievementUser } from 'src/achievements/entities/achievement-users.entity'
import { CourseModule } from 'src/course/course.module'
import { CourseEntity } from 'src/course/entity/course.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ComponentTask,
			AnswersComponentUser,
			SectionEntity,
			CourseUser,
			User,
			UserLevel,
			Achievement,
			AchievementUser,
			CourseEntity
		]),
		CourseModule
	],
	controllers: [ComponentTaskController],
	providers: [
		ComponentTaskService,
		UserService,
		JwtService,
		ComponentTaskListener,
		CoinsService,
		XpService,
		AchievementsService
	]
})
export class ComponentTaskModule {}
