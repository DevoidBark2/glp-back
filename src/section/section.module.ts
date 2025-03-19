import { forwardRef, Module } from '@nestjs/common'
import { SectionService } from './section.service'
import { SectionController } from './section.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SectionEntity } from './entity/section.entity'
import { User } from '../user/entity/user.entity'
import { MainSection } from './entity/main-section.entity'
import { SectionComponentTask } from './entity/section-component-task.entity'
import { CourseEntity } from '../course/entity/course.entity'
import { ComponentTask } from '../component-task/entity/component-task.entity'
import { UserService } from '../user/user.service'
import { CourseUser } from '../course/entity/course-user.entity'
import { JwtService } from '@nestjs/jwt'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			SectionEntity,
			User,
			MainSection,
			SectionComponentTask,
			CourseEntity,
			ComponentTask,
			CourseUser
		]),
		forwardRef(() => AuthModule)
	],
	controllers: [SectionController],
	providers: [SectionService, UserService, JwtService]
})
export class SectionModule {}
