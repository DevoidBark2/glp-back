import { Module } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { StatisticsController } from './statistics.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/entity/user.entity'
import { CourseEntity } from '../course/entity/course.entity'
import PostEntity from '../post/entity/post.entity'
import { SectionEntity } from '../section/entity/section.entity'
import { UserService } from 'src/user/user.service'
import { CourseUser } from 'src/course/entity/course-user.entity'
import { JwtService } from '@nestjs/jwt'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			CourseEntity,
			PostEntity,
			SectionEntity,
			CourseUser
		])
	],
	controllers: [StatisticsController],
	providers: [StatisticsService, UserService, JwtService]
})
export class StatisticsModule {}
