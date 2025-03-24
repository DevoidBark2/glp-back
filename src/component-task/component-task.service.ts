import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { ComponentTask } from './entity/component-task.entity'
import { CreateComponentTaskDto } from './dto/create-component-task.dto'
import { User } from '../user/entity/user.entity'
import { AnswersComponentUser } from './entity/component-task-user.entity'
import { SaveTaskUserDto } from './dto/save-task-user.dto'
import { SectionEntity } from 'src/section/entity/section.entity'
import { UserRole } from 'src/constants/contants'
import { CourseComponentType } from './enum/course-component-type.enum'
import { v4 as uuidv4 } from 'uuid'
import { ChangeComponentOrderDto } from './dto/change-component-order.dto'
import { SectionComponentTask } from '../section/entity/section-component-task.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AddCoinsForUser, AddXpForUser } from './events/component-task.events'
import { CourseService } from 'src/course/course.service'
import { CourseEntity } from 'src/course/entity/course.entity'
import { CourseUser } from '../course/entity/course-user.entity'
import { ExamUsers } from '../exams/entity/exam-users.entity'
import { ExamUsersAnswerEntity } from '../exams/entity/exam-users-answer.entity'
import { ExamEntity } from '../exams/entity/exam.entity'

@Injectable()
export class ComponentTaskService {
	constructor(
		@InjectRepository(ComponentTask)
		private readonly componentTaskRepository: Repository<ComponentTask>,
		@InjectRepository(SectionEntity)
		private readonly sectionRepository: Repository<SectionEntity>,
		@InjectRepository(AnswersComponentUser)
		private readonly answersComponentUserRepository: Repository<AnswersComponentUser>,
		@InjectRepository(CourseEntity)
		private readonly courseEntityRepository: Repository<CourseEntity>,
		@InjectRepository(CourseUser)
		private readonly courseUserRepository: Repository<CourseUser>,
		private eventEmitter: EventEmitter2,
		private courseService: CourseService,
		@InjectRepository(ExamUsersAnswerEntity)
		private examUsersAnswerEntityRepository: Repository<ExamUsersAnswerEntity>,
		@InjectRepository(ExamUsers)
		private examUsersRepository: Repository<ExamUsers>,
		@InjectRepository(ExamEntity)
		private examEntityRepository: Repository<ExamEntity>,
		@InjectRepository(SectionComponentTask)
		private sectionComponentTaskRepository: Repository<SectionComponentTask>
	) {}

	async create(componentTask: CreateComponentTaskDto, user: User) {
		const newComponent = await this.componentTaskRepository.save({
			id: uuidv4(),
			user,
			...componentTask
		})

		const newComponentUser = newComponent.user

		return {
			...{
				id: newComponent.id,
				title: newComponent.title,
				created_at: newComponent.created_at,
				type: newComponent.type,
				status: newComponent.status
			},
			user: {
				id: newComponentUser.id,
				first_name: newComponentUser.first_name,
				second_name: newComponentUser.second_name,
				last_name: newComponentUser.last_name,
				role: newComponentUser.role,
				email: newComponentUser.email,
				phone: newComponentUser.phone
			}
		}
	}

	async getAll(user: User) {
		return user.role !== UserRole.SUPER_ADMIN
			? this.componentTaskRepository.find({
					where: {
						user: { id: user.id }
					},
					relations: {
						user: true
					},
					select: {
						id: true,
						title: true,
						type: true,
						created_at: true,
						status: true,
						user: {
							id: true,
							first_name: true,
							second_name: true,
							last_name: true,
							email: true,
							role: true
						}
					},
					order: {
						user: {
							role: 'DESC'
						}
					}
				})
			: this.componentTaskRepository.find({
					relations: {
						user: true
					},
					select: {
						id: true,
						title: true,
						type: true,
						created_at: true,
						status: true,
						user: {
							id: true,
							first_name: true,
							second_name: true,
							last_name: true,
							email: true,
							role: true
						}
					},
					order: {
						user: {
							role: 'DESC'
						}
					}
				})
	}

	async change(component: CreateComponentTaskDto, user: User) {
		await this.componentTaskRepository.update(component.id, {
			user: user,
			...component
		})
	}

	async delete(componentId: string, user: User) {
		const componentTask = await this.componentTaskRepository.findOne({
			where: { id: componentId, user: { id: user.id } }
		})

		if (!componentTask) {
			throw 'Ошибка при удалении компонента!'
		}
		await this.componentTaskRepository.delete(componentId)
	}

	async searchComponent(query: string, user: User) {
		const queryString = `%${query}%`

		return await this.componentTaskRepository.find({
			where: [
				{
					user: { id: user.id },
					title: ILike(queryString)
				}
			],
			select: {
				id: true,
				title: true,
				type: true,
				sort: true,
				status: true
			}
		})
	}

	async getComponentById(id: string) {
		return await this.componentTaskRepository.findOne({
			where: { id: id }
		})
	}

	async changeComponentOrder(body: ChangeComponentOrderDto, user: User) {
		body.components.map(async component => {
			const componentTask =
				await this.sectionComponentTaskRepository.findOne({
					where: {
						id: component.id,
						section: { id: body.sectionId }
					}
				})

			await this.sectionComponentTaskRepository.update(componentTask.id, {
				sort: component.sort
			})
		})
	}

	async addAnswerForTask(body: SaveTaskUserDto, user: User) {
		console.log(body)

		const course = await this.courseEntityRepository.findOne({
			where: {
				id: body.courseId
			}
		})

		const section =
			body.currentSection !== -1
				? await this.sectionRepository.findOne({
						where: { id: Number(body.currentSection) },
						relations: {
							course: true
						}
					})
				: null

		const currentTask = await this.componentTaskRepository.findOne({
			where: { id: body.task.id }
		})

		const results = currentTask.questions?.map((question, index) => {
			const correctOptions = Array.isArray(question.correctOption)
				? question.correctOption
				: [question.correctOption]

			const userAnswer =
				Array.isArray(body.answers) &&
				currentTask.type === CourseComponentType.Quiz
					? body.answers[index]
					: body.answers

			let isCorrect: boolean

			if (currentTask.type === CourseComponentType.MultiPlayChoice) {
				const incorrectAnswers = body.answers.filter(
					(ans: any) => !correctOptions.includes(ans)
				).length

				isCorrect =
					incorrectAnswers === 0 &&
					body.answers.length === correctOptions.length
			} else {
				isCorrect = correctOptions.includes(userAnswer as number)
			}

			return {
				id: question.id,
				question: question.question,
				userAnswer,
				isCorrect
			}
		}) ?? [
			{
				id: currentTask.id,
				question: currentTask.title,
				userAnswer: body.answers,
				isCorrect: String(body.answers) === currentTask.answer
			}
		]

		const existUserAnswer = body.task.userAnswer
			? await this.answersComponentUserRepository.findOne({
					where: { id: Number(body.task.userAnswer.id) }
				})
			: null

		const existUserExamAnswer = body.task.userAnswer
			? await this.examUsersAnswerEntityRepository.findOne({
					where: { id: Number(body.task.userAnswer.id) }
				})
			: null

		let examUserSavedAnswer: ExamUsersAnswerEntity
		let savedAnswer: AnswersComponentUser

		// const previousCorrectAnswers = Array.isArray(
		// 	body.task?.userAnswer?.answer
		// )
		// 	? body.task.userAnswer.answer.filter(ans => ans.isCorrect).length
		// 	: 0

		// const currentCorrectAnswers = Array.isArray(results)
		// 	? results.filter(ans => ans.isCorrect).length
		// 	: (results as any).isCorrect
		// 		? 1
		// 		: 0

		// // Вычисляем количество новых исправленных ответов
		// const newlyCorrectedAnswers =
		// 	currentCorrectAnswers - previousCorrectAnswers

		if (!existUserExamAnswer) {
			examUserSavedAnswer =
				await this.examUsersAnswerEntityRepository.save({
					user,
					task: body.task,
					course: course,
					answer: results
				})
		} else {
			existUserExamAnswer.answer = results
			await this.examUsersAnswerEntityRepository.save(existUserExamAnswer)
		}

		// ТУТ НАДО ВОЗРАЩАТЬ А НЕ ЭТО  ДЕЛАТЬ
		if (!existUserAnswer) {
			savedAnswer = await this.answersComponentUserRepository.save({
				user,
				task: body.task,
				answer: results,
				section
			})
		} else {
			existUserAnswer.answer = results
			savedAnswer = existUserAnswer
			await this.answersComponentUserRepository.save(existUserAnswer)
		}

		if (!section) {
			const answerToUse = examUserSavedAnswer || existUserExamAnswer

			if (answerToUse?.answer?.length) {
				answerToUse.answer.map(it => {
					delete it.isCorrect
				})
			}

			return {
				userAnswer: {
					id: answerToUse.id,
					type: body.task.type,
					answer: answerToUse?.answer || []
				}
			}
		}

		// // Начисляем награду только за новые исправленные ответы
		// if (newlyCorrectedAnswers > 0) {
		// 	this.eventEmitter.emit(
		// 		'coins.added',
		// 		new AddCoinsForUser(user.id, newlyCorrectedAnswers * 50)
		// 	)
		// 	this.eventEmitter.emit(
		// 		'xp.added',
		// 		new AddXpForUser(user.id, newlyCorrectedAnswers * 25)
		// 	)
		// }

		const correctAnswersCount =
			Array.isArray(results) &&
			results.filter(res => res.isCorrect).length
		const totalAnswersCount = Array.isArray(results) && results.length

		const progress = await this.courseService.calculateUserProgress(
			user,
			body.courseId
		)

		const userCourse = await this.courseUserRepository.findOne({
			where: {
				user: { id: user.id },
				course: { id: body.courseId }
			}
		})

		await this.courseUserRepository.update(userCourse.id, {
			progress: progress
		})

		if (progress === 100) {
			console.log('YOOO')
		}

		return {
			userAnswer: {
				id: savedAnswer.id,
				type: body.task.type,
				answer: savedAnswer.answer,
				correctAnswers: correctAnswersCount,
				totalAnswers: totalAnswersCount,
				progress: progress
			}
		}
	}

	async submitExamUser(examId: number, courseId: number, userId: string) {
		const userAnswers = await this.examUsersAnswerEntityRepository.find({
			where: {
				user: { id: userId },
				course: { id: courseId }
			},
			relations: { task: true }
		})

		const examUser = await this.examUsersRepository.findOne({
			where: {
				id: examId
			},
			relations: {
				exam: true
			}
		})
		const exam = await this.examEntityRepository.findOne({
			where: {
				id: examUser.exam.id
			},
			relations: {
				components: {
					componentTask: true
				}
			}
		})

		const userScore =
			this.courseService.calculateTotalUserPoints(userAnswers)

		const totalExamScore = this.calculateTotalPointsFromTasks(
			exam.components.map(it => it.componentTask)
		)

		const percentageScore = Math.round((userScore / totalExamScore) * 100)

		const userExam = await this.examUsersRepository.findOne({
			where: {
				user: { id: userId },
				exam: { id: exam.id }
			}
		})
		await this.examUsersRepository.update(userExam.id, {
			user: { id: userId },
			progress: percentageScore,
			isEndExam: true
		})

		const examData = await this.examEntityRepository.findOne({
			where: { course: { id: courseId } },
			relations: { components: { componentTask: true }, exam: true },
			order: { components: { sort: 'ASC' } }
		})

		const userAnswersMap = new Map(
			userAnswers
				.filter(answer => answer?.task?.id)
				.map(answer => [
					answer?.task.id,
					{ id: answer?.id, answer: answer?.answer }
				])
		)

		const courseUser = await this.courseUserRepository.findOne({
			where: {
				course: { id: courseId },
				user: { id: userId }
			}
		})
		console.log(courseUser)
		await this.courseUserRepository.update(courseUser.id, {
			has_certificate: percentageScore > 75
		})

		examData.components.forEach(component => {
			if (!component.componentTask) return

			const taskId = component.componentTask.id
			const userAnswerRecord = userAnswersMap.get(taskId)

			component.componentTask = {
				id: taskId,
				userAnswer: userAnswerRecord
					? {
							...userAnswerRecord,
							courseUser: undefined,
							user: undefined,
							task: undefined,
							section: undefined,
							created_at: undefined
						}
					: null,
				title: undefined,
				description: undefined,
				type: undefined,
				questions: undefined,
				content_description: undefined,
				created_at: undefined,
				status: undefined,
				sort: undefined
			} as ComponentTask

			delete component.componentTask.answer
			component.componentTask.questions?.forEach(it => {
				delete it.correctOption
			})
		})

		return {
			...examData,
			title: exam.title,
			...{
				success: percentageScore > 75,
				message:
					percentageScore > 75
						? '🎉 Поздравляем! Вы успешно завершили экзамен и получили сертификат. Вы можете скачать его в своём профиле.'
						: '😞 К сожалению, ваш результат ниже 75%. Не расстраивайтесь! Удача обязательно улыбнётся вам в следующий раз.'
			}
		}
	}

	private calculateTotalPointsFromTasks(tasks: ComponentTask[]): number {
		let totalPoints = 0

		tasks.forEach(task => {
			if (task.type === CourseComponentType.Quiz) {
				totalPoints += task.questions?.length || 0
			} else if (task.type === CourseComponentType.MultiPlayChoice) {
				totalPoints += 3
			} else if (task.type === CourseComponentType.SimpleTask) {
				totalPoints += 4
			}
		})

		return totalPoints
	}
}
