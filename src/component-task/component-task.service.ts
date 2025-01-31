import { BadRequestException, Injectable } from '@nestjs/common'
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

@Injectable()
export class ComponentTaskService {
	constructor(
		@InjectRepository(ComponentTask)
		private readonly componentTaskRepository: Repository<ComponentTask>,
		@InjectRepository(SectionEntity)
		private readonly sectionRepository: Repository<SectionEntity>,
		@InjectRepository(AnswersComponentUser)
		private readonly answersComponentUserRepository: Repository<AnswersComponentUser>
	) {}

	async create(componentTask: CreateComponentTaskDto, user: User) {
		const newComponent = await this.componentTaskRepository.save({
			user,
			...componentTask
		})

		const newComponentUser = newComponent.user

		return {
			...newComponent,
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

	async delete(componentId: number, user: User) {
		const componentTask = await this.componentTaskRepository.findOne({
			where: { id: componentId, user: user }
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
			]
		})
	}

	async getComponentById(id: number) {
		return await this.componentTaskRepository.findOne({
			where: { id: id }
		})
	}

	async addAnswerForTask(body: SaveTaskUserDto, user: User) {
		const task = await this.componentTaskRepository.findOne({
			where: { id: body.task.id }
		})

		const section = await this.sectionRepository.findOne({
			where: {
				id: Number(body.currentSection)
			}
		})

		if (!task) {
			throw new BadRequestException(
				`Задачи с ID ${body.task.id} не существует`
			)
		}

		// Проверяем, является ли `answers` массивом чисел или строкой
		const isAnswersArray = Array.isArray(body.answers)

		console.log('Ответ', body.answers)

		console.log('ЗАДАЧА', task)
		const results = task.questions
			? task.questions.map((question, index) => {
					console.log('Вопрос', question)
					const userAnswer =
						isAnswersArray && task.type === CourseComponentType.Quiz
							? body.answers[index]
							: task.type === CourseComponentType.MultiPlayChoice
								? body.answers
								: body.answers // Если массив, берём по индексу
					const taskType = task.type

					// Проверяем корректность ответа в зависимости от типа задачи
					let isCorrect
					if (taskType === CourseComponentType.MultiPlayChoice) {
						// Сравниваем массивы для MultiPlayChoice
						isCorrect =
							Array.isArray(userAnswer) &&
							Array.isArray(question.correctOption) &&
							userAnswer.length ===
								question.correctOption.length &&
							userAnswer.every(
								answer =>
									Array.isArray(question.correctOption) &&
									question.correctOption.includes(answer)
							)
					} else {
						// Для остальных типов задач
						isCorrect = question.correctOption === userAnswer
					}

					return {
						id: question.id,
						question: question.question,
						userAnswer,
						isCorrect
					}
				})
			: {
					id: task.id,
					question: task.title,
					userAnswer: body.answers,
					correctAnswer: task.answer,
					isCorrect: String(body.answers) === task.answer
				}

		await this.answersComponentUserRepository.save({
			user,
			task,
			answer: results,
			section: section
		})

		// if (CourseComponentType.MultiPlayChoice === body.task.type || CourseComponentType.Quiz === body.task.type) {
		// 	resBody['userAnswer'] = {
		// 		correctAnswers: results.filter(it => typeof it === 'object' && it.userAnswer === it.correctAnswer).length,
		// 		totalAnswers: results.length
		// 	};
		// }

		return {
			answer: results
		}
	}
}
