import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExamEntity } from './entity/exam.entity'
import { User } from '../user/entity/user.entity'
import { CreateExamDto } from './dto/create-exam.dto'
import { ExamsComponent } from './entity/exams-components.entity'
import { SetExamForCourseDto } from './dto/set-exam-for-course.dto'
import { CourseEntity } from 'src/course/entity/course.entity'

@Injectable()
export class ExamsService {
	constructor(
		@InjectRepository(ExamEntity)
		private readonly examEntityRepository: Repository<ExamEntity>,
		@InjectRepository(ExamsComponent)
		private readonly examsComponentRepository: Repository<ExamsComponent>,
		@InjectRepository(CourseEntity)
		private readonly courseRepository: Repository<CourseEntity>
	) { }

	async findAll(user: User) {
		return await this.examEntityRepository.find({
			where: {
				user: { id: user.id }
			},
			relations: {
				user: true,
			},
			select: {
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true,
					role: true
				}
			},
			order: {
				user: {
					role: 'DESC'
				},
				created_at: 'DESC'
			}
		})

	}

	async createExam(components: CreateExamDto, user: User) {
		const examEntity = new ExamEntity()
		examEntity.title = components.title
		examEntity.user = user

		await this.examEntityRepository.save(examEntity)

		const examComponents = components.components.map(component => {
			const examComponent = new ExamsComponent()
			examComponent.exam = examEntity
			examComponent.component = component
			examComponent.sort = component.sort

			return examComponent
		})

		await this.examsComponentRepository.save(examComponents)
	}

	async deleteExam(id: number, user: User) {
		const examUser = await this.examEntityRepository.findOne({
			where: {
				id: id,
				user: { id: user.id }
			}
		})

		if (!examUser) {
			throw new BadRequestException(`Данный экзамен вам не принадлежит!`)
		}

		await this.examEntityRepository.delete(id)
	}

	async setExamForCourse(body: SetExamForCourseDto) {
		const exam = await this.examEntityRepository.findOne({
			where: {
				id: body.examId
			}
		})

		const course = await this.courseRepository.findOne({
			where: {
				id: body.courseId
			}
		})

		await this.courseRepository.update(course.id, {
			exam: exam
		})
	}
}
