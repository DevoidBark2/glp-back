import { Module } from '@nestjs/common'
import { ExamsService } from './exams.service'
import { ExamsController } from './exams.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExamEntity } from './entity/exam.entity'
import { UserModule } from '../user/user.module'
import { ExamsComponent } from './entity/exams-components.entity'
import { CourseEntity } from 'src/course/entity/course.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([ExamEntity, ExamsComponent, CourseEntity]),
		UserModule
	],
	controllers: [ExamsController],
	providers: [ExamsService]
})
export class ExamsModule { }
