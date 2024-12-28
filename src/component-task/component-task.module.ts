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

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ComponentTask,
			AnswersComponentUser,
			SectionEntity,
			CourseUser,
			User
		])
	],
	controllers: [ComponentTaskController],
	providers: [ComponentTaskService,UserService, JwtService]
})
export class ComponentTaskModule {}
