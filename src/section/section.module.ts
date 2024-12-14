import { Module } from '@nestjs/common'
import { SectionService } from './section.service'
import { SectionController } from './section.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SectionEntity } from './entity/section.entity'
import { User } from '../user/entity/user.entity'
import { MainSection } from './entity/main-section.entity'
import { SectionComponentTask } from './entity/section-component-task.entity'
import { CourseEntity } from '../course/entity/course.entity'
import { ComponentTask } from '../component-task/entity/component-task.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			SectionEntity,
			User,
			MainSection,
			SectionComponentTask,
			CourseEntity,
			ComponentTask
		])
	],
	controllers: [SectionController],
	providers: [SectionService]
})
export class SectionModule {}
