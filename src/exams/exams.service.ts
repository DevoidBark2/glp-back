import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ExamEntity } from './entity/exam.entity'
import { User } from '../user/entity/user.entity'
import { CreateExamDto } from './dto/create-exam.dto'
import { ExamsComponent } from './entity/exams-components.entity'
import { SetExamForCourseDto } from './dto/set-exam-for-course.dto'
import { CourseEntity } from 'src/course/entity/course.entity'
import { ChangeExamDto } from './dto/change-exam.dto'

@Injectable()
export class ExamsService {
	constructor(
		@InjectRepository(ExamEntity)
		private readonly examEntityRepository: Repository<ExamEntity>,
		@InjectRepository(ExamsComponent)
		private readonly examsComponentRepository: Repository<ExamsComponent>,
		@InjectRepository(CourseEntity)
		private readonly courseRepository: Repository<CourseEntity>
	) {}

	async findAll(user: User) {
		return await this.examEntityRepository.find({
			where: {
				user: { id: user.id }
			},
			relations: {
				user: true
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
			examComponent.componentTask = component
			examComponent.sort = component.sort

			return examComponent
		})

		await this.examsComponentRepository.save(examComponents)
	}

	async changeExam(body: ChangeExamDto, examId: number) {
		console.log(body)
		console.log(examId)
		await this.examsComponentRepository.delete({
			exam: { id: examId }
		})

		const exam = await this.examEntityRepository.findOne({
			where: {
				id: examId
			}
		})

		const examComponents = body.components.map(component => {
			const examComponent = new ExamsComponent()
			examComponent.exam = exam
			examComponent.componentTask = component
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

	async getExamById(id: number) {
		const exam = await this.examEntityRepository.findOne({
			where: {
				id: id
			},
			relations: {
				components: {
					componentTask: true
				}
			},
			select: {
				id: true,
				title: true,
				components: {
					id: true,
					sort: true,
					componentTask: {
						id: true,
						title: true,
						sort: true,
						type: true,
						created_at: true
					}
				}
			}
		})

		return {
			id: exam.id,
			title: exam.title,
			components: exam.components.map(component => {
				return {
					id: component.componentTask.id,
					title: component.componentTask.title,
					type: component.componentTask.type,
					sort: component.sort,
					status: component.componentTask.status,
					created_at: component.componentTask.created_at
				}
			})
		}
	}

	// async startExam(userId: string, examId: string) {
	// 	const session = new ExamSession();
	// 	session.userId = userId;
	// 	session.examId = examId;
	// 	session.startTime = new Date();
	// 	session.endTime = new Date(session.startTime.getTime() + 24 * 60 * 60 * 1000);
	// 	await this.examSessionRepository.save(session);
	// 	return session.startTime;
	// }
	//
	// async getTimeLeft(userId: string) {
	// 	const session = await this.examSessionRepository.findOne({ where: { userId } });
	// 	if (!session) throw new BadRequestException('Экзамен не найден');
	// 	const timeLeft = session.endTime.getTime() - new Date().getTime();
	// 	return timeLeft > 0 ? timeLeft : 0;
	// }
	//
	// async saveProgress(userId: string, questionIndex: number, answer: string) {
	// 	const answerRecord = new ExamAnswer();
	// 	answerRecord.userId = userId;
	// 	answerRecord.questionIndex = questionIndex;
	// 	answerRecord.answer = answer;
	// 	await this.examAnswerRepository.save(answerRecord);
	// }
	//
	// async isExamFinished(userId: string) {
	// 	const session = await this.examSessionRepository.findOne({ where: { userId } });
	// 	return session ? new Date() >= session.endTime : false;
	// }
}
