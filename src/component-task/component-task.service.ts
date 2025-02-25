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

	async changeComponentOrder(body: ChangeComponentOrderDto, user: User) {
		const currentSection = await this.sectionRepository.findOne({
			where: { id: body.sectionId },
			relations: { sectionComponents: true }
		})

		if (!currentSection) {
			throw new Error('Раздел не найден')
		}

		// Обновляем sort для каждого компонента
		await Promise.all(
			body.components.map(({ id, sort }) =>
				this.sectionRepository
					.createQueryBuilder()
					.update(SectionComponentTask)
					.set({ sort })
					.where('id = :id', { id })
					.execute()
			)
		)

		return { message: 'Порядок компонентов обновлен' }
	}

	async addAnswerForTask(body: SaveTaskUserDto, user: User) {
		console.log('Anwser', body)

		const section = await this.sectionRepository.findOne({
			where: { id: Number(body.currentSection) }
		})

		const results = body.task.questions?.map((question, index) => {
			const correctOptions = Array.isArray(question.correctOption)
				? question.correctOption
				: [question.correctOption]

			const userAnswer =
				Array.isArray(body.answers) &&
				body.task.type === CourseComponentType.Quiz
					? body.answers[index]
					: body.answers

			let isCorrect: boolean

			if (body.task.type === CourseComponentType.MultiPlayChoice) {
				console.log('Correct', correctOptions)
				console.log('Answer user', body.answers)

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
		}) ?? {
			id: body.task.id,
			question: body.task.title,
			userAnswer: body.answers,
			isCorrect: String(body.answers) === body.task.answer
		}

		const existUserAnswer = body.task.userAnswer
			? await this.answersComponentUserRepository.findOne({
					where: { id: Number(body.task.userAnswer.id) }
				})
			: null

		let savedAnswer: AnswersComponentUser

		console.log(results)

		if (!existUserAnswer) {
			savedAnswer = await this.answersComponentUserRepository.save({
				user,
				task: body.task,
				answer: results,
				section
			})
		} else {
			existUserAnswer.answer = results
			await this.answersComponentUserRepository.save(existUserAnswer)
			savedAnswer = existUserAnswer
		}

		const correctAnswersCount =
			Array.isArray(results) &&
			results.filter(res => res.isCorrect).length
		const totalAnswersCount = Array.isArray(results) && results.length

		return {
			userAnswer: {
				id: savedAnswer.id,
				type: body.task.type,
				answer: savedAnswer.answer,
				correctAnswers: correctAnswersCount,
				totalAnswers: totalAnswersCount
			}
		}
	}
}
