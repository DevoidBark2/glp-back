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
import { v4 as uuidv4 } from 'uuid'

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
			id: uuidv4(),
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

	async delete(componentId: string, user: User) {
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

	async getComponentById(id: string) {
		return await this.componentTaskRepository.findOne({
			where: { id: id }
		})
	}

	async addAnswerForTask(body: SaveTaskUserDto, user: User) {
		const task = await this.componentTaskRepository.findOne({
			where: { id: body.task.id }
		})

		if (!task) {
			throw new BadRequestException(
				`Задачи с ID ${body.task.id} не существует`
			)
		}

		const section = await this.sectionRepository.findOne({
			where: { id: Number(body.currentSection) }
		})

		console.log('Ответ', body.answers)
		console.log('ЗАДАЧА', task)

		// Обрабатываем ответы пользователя
		const results = task.questions?.map((question, index) => {
			const userAnswer = Array.isArray(body.answers)
				? body.answers[index]
				: body.answers

			// Приводим `question.correctOption` к массиву
			const correctOptions = Array.isArray(question.correctOption)
				? question.correctOption
				: [question.correctOption]

			// Проверка правильности ответа
			const isCorrect =
				task.type === CourseComponentType.MultiPlayChoice
					? Array.isArray(userAnswer) &&
						userAnswer.every(answer =>
							correctOptions.includes(answer)
						) &&
						correctOptions.every(correct =>
							userAnswer.includes(correct)
						)
					: correctOptions.includes(userAnswer as number)

			return {
				id: question.id,
				question: question.question,
				userAnswer,
				isCorrect
			}
		}) ?? [
			{
				id: task.id,
				question: task.title,
				userAnswer: body.answers,
				isCorrect: String(body.answers) === task.answer
			}
		]

		// Сохранение результата
		const data = await this.answersComponentUserRepository.save({
			user,
			task,
			answer: results,
			section
		})

		return {
			message: 'Ответы успешно сохранены',
			userAnswer: {
				id: data.id,
				type: task.type,
				answer: data.answer
			}
		}
	}
}
