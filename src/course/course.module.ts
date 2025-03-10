import { Module } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseController } from './course.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { User } from '../user/entity/user.entity'
import { CourseEntity } from './entity/course.entity'
import { CategoryEntity } from '../category/entity/category.entity'
import { EventsModule } from '../events/events.module'
import { CourseUser } from './entity/course-user.entity'
import { UserModule } from 'src/user/user.module'
import { AnswersComponentUser } from 'src/component-task/entity/component-task-user.entity'
import { SectionEntity } from 'src/section/entity/section.entity'
import { ExamEntity } from '../exams/entity/exam.entity'
import { ExamUsers } from '../exams/entity/exam-users.entity'
import { BullModule } from '@nestjs/bull'
import { ExamProcessor } from './processors/exam.processor'
import { ExamsModule } from 'src/exams/exams.module'
import { ExamUsersAnswerEntity } from '../exams/entity/exam-users-answer.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			CourseEntity,
			User,
			CategoryEntity,
			CourseUser,
			AnswersComponentUser,
			SectionEntity,
			ExamEntity,
			ExamUsers,
			ExamUsersAnswerEntity
		]),
		BullModule.registerQueue({
			name: 'examQueue'
		}),
		JwtModule,
		EventsModule,
		UserModule,
		ExamsModule
	],
	controllers: [CourseController],
	providers: [ExamProcessor, CourseService],
	exports: [CourseService]
})
export class CourseModule {}
