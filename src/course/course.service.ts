import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CourseEntity } from './entity/course.entity'
import { ILike, In, Like, Repository } from 'typeorm'
import { CreateCourseDto } from './dto/create_course.dto'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entity/user.entity'
import { CategoryEntity } from '../category/entity/category.entity'
import { StatusCourseEnum } from './enum/status_course.enum'
import { ChangeCourseDto } from './dto/change-course.dto'
import { UserRole } from 'src/constants/contants'
import { SubscribeCourseDto } from './dto/subsribe-course.dto'
import { CourseUser } from './entity/course-user.entity'
import { UserService } from 'src/user/user.service'
import { AnswersComponentUser } from 'src/component-task/entity/component-task-user.entity'
import { SectionEntity } from 'src/section/entity/section.entity'
import { CourseComponentType } from 'src/component-task/enum/course-component-type.enum'

@Injectable()
export class CourseService {
	constructor(
		@InjectRepository(CourseEntity)
		private readonly courseEntityRepository: Repository<CourseEntity>,
		@InjectRepository(CategoryEntity)
		private readonly categoryEntityRepository: Repository<CategoryEntity>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		@InjectRepository(CourseUser)
		private readonly courseUserRepository: Repository<CourseUser>,
		@InjectRepository(AnswersComponentUser)
		private readonly answersComponentUserRepository: Repository<AnswersComponentUser>,
		@InjectRepository(SectionEntity)
		private readonly sectionRepository: Repository<SectionEntity>
	) { }

	async findAll() {
		return await this.courseEntityRepository.find({
			where: {
				status: StatusCourseEnum.ACTIVE
			},
			relations: {
				user: true
			},
			select: {
				id: true,
				name: true,
				image: true,
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true
				}
			}
		})
	}

	async getCoursesByCategory(categoryId: number) {
		if (categoryId === -1) {
			return await this.courseEntityRepository.find({
				where: {
					status: StatusCourseEnum.ACTIVE
				},
				relations: {
					user: true,
					category: true
				},
				select: {
					id: true,
					name: true,
					image: true,
					user: {
						id: true,
						first_name: true,
						second_name: true,
						last_name: true
					}
				}
			})
		}
		const category = await this.categoryEntityRepository.findOne({
			where: { id: categoryId }
		})
		return await this.courseEntityRepository.find({
			where: {
				status: StatusCourseEnum.ACTIVE,
				category: category
			},
			relations: {
				user: true,
				category: true
			},
			select: {
				id: true,
				name: true,
				image: true,
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true
				}
			}
		})
	}

	async getCoursesBySearch(value: string) {
		const searchKeywords = value
			.split(' ')
			.map(word => word.trim())
			.filter(word => word.length > 0)

		return await this.courseEntityRepository.find({
			where: {
				status: StatusCourseEnum.ACTIVE,
				name: ILike(`%${searchKeywords.join('%')}%`), // Ищем по названию курса
				user: {
					first_name: ILike(`%${searchKeywords.join('%')}%`), // Ищем по имени пользователя
					last_name: ILike(`%${searchKeywords.join('%')}%`), // Ищем по фамилии пользователя
					second_name: ILike(`%${searchKeywords.join('%')}%`) // Ищем по отчеству пользователя
				}
			},
			relations: {
				user: true,
				category: true
			},
			select: {
				id: true,
				name: true,
				image: true,
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true
				}
			}
		})
	}

	async findOneById(courseId: number, user: User) {
		// Fetch the course details (exclude courseUsers data for optimization)
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				category: true,
				user: true
			},
			select: {
				id: true,
				name: true,
				image: true,
				small_description: true,
				access_right: true,
				duration: true,
				level: true,
				status: true,
				publish_date: true,
				has_certificate: true,
				content_description: true,
				category: {
					id: true,
					name: true
				},
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true
				}
			}
		})

		// If the course is not found, return null
		if (!course) {
			throw new BadRequestException(`Курс с ID ${courseId} не найден!`)
		}

		// If no token is provided, return the course without `isUserEnrolled`
		if (!user) {
			return {
				...course,
				isUserEnrolled: false // Default value since no user to compare
			}
		}

		// Check if the user is enrolled in the course using a direct query
		const isUserEnrolled =
			(await this.courseEntityRepository
				.createQueryBuilder('course')
				.innerJoin('course.courseUsers', 'courseUser')
				.where('course.id = :courseId', { courseId })
				.andWhere('courseUser.userId = :userId', { userId: user.id })
				.getCount()) > 0

		// Return the course with the additional `isUserEnrolled` field
		return {
			...course,
			isUserEnrolled
		}
	}

	async getCourseMembers(courseId: number) {
		return await this.courseUserRepository.find({
			where: { course: { id: courseId } },
			relations: {
				course: false,
				user: true
			},
			select: {
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true
				}
			}
		})
	}

	async createCourse(createCourse: CreateCourseDto, currentUser: User) {
		console.log(createCourse)
		const category = createCourse.category
			? await this.categoryEntityRepository.findOne({
				where: { id: createCourse.category }
			})
			: null

		return await this.courseEntityRepository.save({
			...createCourse,
			user: currentUser,
			category: category,
			has_certificate: createCourse.has_certificate === 'true'
		})
	}

	async getAllUserCourses(user: User) {
		return user.role === UserRole.SUPER_ADMIN
			? this.courseEntityRepository.find({
				relations: {
					user: true
				},
				order: {
					user: {
						role: 'DESC'
					},
					created_at: 'DESC'
				},
				select: {
					id: true,
					name: true,
					created_at: true,
					status: true,
					duration: true,
					level: true,
					user: {
						id: true,
						first_name: true,
						second_name: true,
						last_name: true,
						phone: true,
						role: true
					}
				}
			})
			: await this.courseEntityRepository.find({
				where: { user: { id: user.id } },
				relations: {
					user: true
				},
				order: {
					user: {
						role: 'DESC'
					}
				},
				select: {
					id: true,
					name: true,
					created_at: true,
					status: true,
					duration: true,
					level: true,
					user: {
						id: true,
						first_name: true,
						second_name: true,
						last_name: true,
						phone: true,
						role: true
					}
				}
			})
	}

	async delete(courseId: number) {
		const course = await this.courseEntityRepository.findOne({
			where: {
				id: courseId
			}
		})

		if (course.status === StatusCourseEnum.IN_PROCESSING) {
			throw new BadRequestException(
				'В данный момент курс в обработке, ожидайте ответа от модератора'
			)
		}

		if (course.status === StatusCourseEnum.ACTIVE) {
			throw new BadRequestException(
				'Курс сейчас опубликован, его нельзя удалить!'
			)
		}

		await this.courseEntityRepository.delete(courseId)
	}

	async publishCourse(courseId: number, req: Request) {
		// const course = await this.courseEntityRepository.findOne({
		// 	where: { id: courseId },
		// 	relations: {
		// 		sections: true
		// 	}
		// })

		// if (course.sections.length < 1) {
		// 	throw new BadRequestException(
		// 		'Данный курс нельзя отправить,так как в нем нет,как минимум 1 раздела'
		// 	)
		// }

		await this.courseEntityRepository.update(courseId, {
			status: StatusCourseEnum.IN_PROCESSING
		})
	}

	async getCourseDetails(id: number) {
		const course = await this.courseEntityRepository.findOne({
			where: {
				id: id
			},
			relations: {
				category: true,
				courseUsers: true,
				sections: {
					sectionComponents: true
				}
			},
			select: {
				courseUsers: {
					id: true,
					enrolledAt: true,
					progress: true,
					user: {
						id: true,
						first_name: true,
						second_name: true,
						last_name: true
					}
				}
			}
		})

		if (!course) {
			throw new BadRequestException(`Курс с ID ${id} не найден`)
		}

		if (course.status === StatusCourseEnum.IN_PROCESSING) {
			throw 'Курс находится в обработке,получить доступ к нему нельзя'
		}

		console.log(course)
		return course
	}

	async getCourseSections(id: number) {
		return await this.sectionRepository.find({
			where: {
				course: { id: id }
			},
			relations: {
				sectionComponents: {
					section: true,
					componentTask: true
				}
			}
		})
	}

	async changeCourse(course: ChangeCourseDto, user: User) {
		const category = await this.categoryEntityRepository.findOne({
			where: {
				id: course.category
			}
		})

		await this.courseEntityRepository.update(course.id, {
			name: course.name,
			image: course.image,
			small_description: course.small_description,
			category: category,
			access_right: course.access_right,
			duration: course.duration,
			level: course.level,
			publish_date: course.publish_date,
			content_description: course.content_description,
			secret_key: course.secret_key,
			status: course.status,
			user: user
		})
	}

	async getCourseMenuById(courseId: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				courseUsers: true,
				sections: {
					parentSection: true,
					sectionComponents: {
						componentTask: true
					}
				}
			},
			order: {
				sections: {
					parentSection: { sort: 'ASC' },
					sort_number: 'ASC'
				}
			}
		})

		if (!course) {
			throw new Error(`Курс с ID ${courseId} не найден!`)
		}

		const sections = course.sections

		const totalCount = this.calculateTotalPoints(sections)

		if (!sections || sections.length === 0) {
			return []
		}

		const sectionIds = sections.map(section => section.id)

		// Загружаем ответы пользователя
		const userAnswers = await this.answersComponentUserRepository.find({
			where: {
				user: { id: user.id },
				section: { id: In(sectionIds) }
			},
			relations: {
				section: true,
				task: true
			}
		})

		const totalUserCount = this.calculateTotalUserPoints(userAnswers)

		const userAnswersMap = new Map(
			userAnswers.map(answer => [answer.section.id, answer.answer])
		)

		// Группируем секции по parentSection
		const mainSectionMap = new Map<number, any>()
		const rootSections: any[] = []

		sections.forEach(section => {
			const sectionId = section.id
			const parentSection = section.parentSection

			// Получаем ответ пользователя для текущего подраздела
			const rawUserAnswer = userAnswersMap.get(sectionId) || null

			// Обработка userAnswer
			let userAnswer = null

			if (rawUserAnswer) {
				if (rawUserAnswer.confirmedStep) {
					userAnswer = { confirmedStep: rawUserAnswer.confirmedStep }
				} else if (Array.isArray(rawUserAnswer)) {
					const totalAnswers = rawUserAnswer.length
					const correctAnswers = rawUserAnswer.filter(
						item => item.isCorrect
					).length
					userAnswer = {
						totalAnswers,
						correctAnswers
					}
				}
			}

			if (parentSection) {
				const mainSectionId = parentSection.id
				if (!mainSectionMap.has(mainSectionId)) {
					mainSectionMap.set(mainSectionId, {
						id: mainSectionId,
						name: parentSection.title,
						children: []
					})
				}
				mainSectionMap.get(mainSectionId).children.push({
					id: sectionId,
					name: section.name,
					userAnswer // Добавляем обработанный ответ пользователя
				})
			} else {
				rootSections.push({
					id: sectionId,
					name: section.name,
					userAnswer, // Добавляем обработанный ответ пользователя
					children: []
				})
			}
		})

		// Собираем итоговый список родительских секций и их потомков
		const groupedSections = [...mainSectionMap.values(), ...rootSections]

		return {
			sections: groupedSections,
			courseName: course.name,
			progress: Math.floor((totalUserCount / totalCount) * 100)
		}
	}

	private calculateTotalPoints(sections: SectionEntity[]) {
		let totalPoints = 0

		sections.forEach(section => {
			section.sectionComponents.forEach(it => {
				// Проверка для Quiz задачи
				if (it.componentTask.type === CourseComponentType.Quiz) {
					const count = it.componentTask.questions.length // Количество вопросов — это максимальные очки
					totalPoints += count
				}

				// Проверка для MultiPlayChoice задачи
				if (
					it.componentTask.type ===
					CourseComponentType.MultiPlayChoice
				) {
					const count = 3 // Максимальные очки для MultiPlayChoice
					totalPoints += count
				}

				// Проверка для SimpleTask задачи
				if (it.componentTask.type === CourseComponentType.SimpleTask) {
					const count = 4 // Максимальные очки для SimpleTask
					totalPoints += count
				}
			})
		})

		return totalPoints
	}

	private calculateTotalUserPoints(userAnswers: AnswersComponentUser[]) {
		let total = 0

		userAnswers.map(it => {
			console.log(it)

			if (it.task) {
				if (it.task.type === CourseComponentType.Quiz) {
					it.answer.map(it => {
						if (it.isCorrect) {
							total++
						}
					})
				} else if (
					it.task.type === CourseComponentType.MultiPlayChoice
				) {
					it.answer.map(it => {
						if (it.isCorrect) {
							total += 3
						}
					})
				} else {
				}
			}
		})

		return total
	}

	async getFullCourseById(courseId: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				sections: {
					sectionComponents: {
						componentTask: true
					},
					parentSection: true
				}
			},
			order: {
				sections: {
					sectionComponents: { sort: 'ASC' },
					parentSection: { sort: 'ASC' },
					sort_number: 'ASC'
				}
			}
		})

		if (!course) {
			throw new Error('Course with ID ${courseId} not found')
		}

		const sections = course.sections

		if (!sections || sections.length === 0) {
			return {
				courseId: course.id,
				courseName: course.name,
				sections: []
			}
		}

		const sectionIds = sections.map(section => section.id)

		// Получение всех ответов пользователя для разделов (включая задачи и без них)
		const userAnswers = await this.answersComponentUserRepository.find({
			where: {
				user: { id: user.id },
				section: { id: In(sectionIds) }
			},
			relations: ['task', 'section']
		})

		// Создаем Map по sectionId для быстрого доступа
		const userAnswersMap = new Map(
			userAnswers.map(answer => [answer.section.id, answer.answer])
		)

		// Группируем секции по parentSection
		const mainSectionMap = new Map<number, any>()
		const rootSections: any[] = []

		// Обработка секций и добавление ответов в компоненты задач
		sections.forEach(section => {
			const sectionId = section.id
			const parentSection = section.parentSection

			if (parentSection) {
				const mainSectionId = parentSection.id
				if (!mainSectionMap.has(mainSectionId)) {
					mainSectionMap.set(mainSectionId, {
						id: mainSectionId,
						name: parentSection.title,
						children: []
					})
				}
				mainSectionMap.get(mainSectionId).children.push({
					id: sectionId,
					name: section.name,
					...section,
					children: []
				})
			} else {
				rootSections.push({
					id: sectionId,
					name: section.name,
					...section,
					children: []
				})
			}

			// Применяем ответы к компонентам задач
			const userAnswer = userAnswersMap.get(sectionId) || null
			section.sectionComponents.forEach(component => {
				if (component.componentTask) {
					component.componentTask.userAnswer = userAnswer
				}
			})
		})

		// Собираем все секции в один результат
		const groupedSections = [...mainSectionMap.values(), ...rootSections]

		return {
			courseId: course.id,
			name: course.name,
			sections: groupedSections
		}
	}

	async subscribeCourse(body: SubscribeCourseDto) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: body.courseId }
		})

		if (!course) {
			throw new BadRequestException(
				`Курс с ID ${body.courseId} не найден!`
			)
		}

		const user = await this.userRepository.findOne({
			where: { id: body.userId }
		})

		if (!user) {
			throw new BadRequestException(
				`Пользователь с ID ${body.courseId} не найден!`
			)
		}

		const isSubscribeCourseByUser = await this.courseUserRepository.findOne(
			{
				where: {
					user: user,
					course: course
				}
			}
		)

		if (isSubscribeCourseByUser) {
			return null
		}

		return await this.courseUserRepository.save({
			user: user,
			course: course
		})
	}

	async leaveCourse(id: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: id }
		})
		const courseUser = await this.courseUserRepository.findOne({
			where: {
				user: user,
				course: course
			}
		})

		if (!course) {
			throw new BadRequestException(`Курс с ID ${id} не найден!`)
		}

		await this.courseUserRepository.delete(courseUser.id)
	}

	async updateSectionStep(prevSectionStep: number, user: User) {
		if (prevSectionStep === -1) {
			return
		}
		// Найти раздел с указанным ID, включая связанные компоненты.
		const section = await this.sectionRepository.findOne({
			where: { id: prevSectionStep },
			relations: { sectionComponents: { componentTask: true } }
		})

		if (!section) {
			throw new BadRequestException(
				`Раздел с ID ${prevSectionStep} не существует!`
			)
		}

		// Проверить, есть ли в разделе задачи типа Quiz или Matching или SimpleTask
		const hasTasks = section.sectionComponents.some(
			it =>
				it.componentTask &&
				[
					CourseComponentType.Quiz,
					CourseComponentType.MultiPlayChoice,
					CourseComponentType.SimpleTask
				].includes(it.componentTask.type)
		)

		if (hasTasks) {
			return // Если задачи есть, ничего не делать.
		}

		// Проверить, существует ли запись для данного пользователя и раздела
		const sectionExist = await this.answersComponentUserRepository.findOne({
			where: {
				section: { id: prevSectionStep },
				user: { id: user.id }
			}
		})

		if (sectionExist) {
			return // Если запись существует, ничего не делать.
		}

		// Сохранить новую запись в таблице
		try {
			return await this.answersComponentUserRepository.save({
				user: user,
				answer: { confirmedStep: prevSectionStep },
				section: section
			})
		} catch (error) {
			console.error('Ошибка при сохранении записи:', error)
			throw new Error(
				'Ошибка при добавлении записи. Пожалуйста, попробуйте снова.'
			)
		}
	}

	async getCurrentSection(courseId: number, sectionId: number, user: User) {
		if (Number(sectionId) === -1) {
			const courseUser = await this.courseUserRepository.findOne({
				where: {
					user: { id: user.id },
					course: { id: courseId }
				}
			})

			const userProgress = courseUser.progress

			if (userProgress < 90) {
				return {
					message:
						'Экзамен сейчас не доступен, Вы не достигли минимального балла по прохождению курса'
				}
			}

			return 'Содержимое экзамена'
		}
		console.log('SectionID', sectionId)
		// Получаем курс с секциями и их компонентами по заданному courseId
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				sections: {
					sectionComponents: {
						componentTask: true
					}
				}
			}
		})

		console.log(course)

		// Если курс не найден, выбрасываем ошибку
		if (!course) {
			throw new Error(`Course with ID ${courseId} not found`)
		}

		// Находим нужную секцию по sectionId
		const currentSection = course.sections.find(
			section => section.id === sectionId
		)

		if (!currentSection) {
			throw new Error(
				`Section with ID ${sectionId} not found in course with ID ${courseId}`
			)
		}

		// Получаем компоненты текущей секции
		const sectionComponents = currentSection.sectionComponents

		// Создаем структуру ответа, добавляя ответы пользователя к компонентам, если они есть
		const userAnswers = await this.answersComponentUserRepository.find({
			where: {
				user: { id: user.id },
				section: { id: sectionId }
			},
			relations: ['task', 'section']
		})

		// Создаем Map для быстрого доступа к ответам пользователя
		const userAnswersMap = new Map(
			userAnswers.map(answer => [
				`${answer.task ? answer.task.id : 'null'}-${answer.section.id}`,
				answer.answer
			])
		)

		console.log('!!!!!!!!!!!!', userAnswersMap)

		// Применяем ответы к компонентам задач
		sectionComponents.forEach(component => {
			if (component.componentTask) {
				const taskId = component.componentTask.id
				const answerKey = `${taskId}-${sectionId}`
				component.componentTask.userAnswer =
					userAnswersMap.get(answerKey) || null

				console.log('HERE', component.componentTask.questions)

				if (component.componentTask.type === CourseComponentType.Text) {
					const { id, title, description, type } =
						component.componentTask
					component.componentTask = {
						id,
						title,
						description,
						type,
						userAnswer: component.componentTask.userAnswer,
						content_description:
							component.componentTask.content_description,
						questions: undefined,
						created_at: undefined,
						status: undefined,
						tags: undefined,
						sort: undefined,
						sectionComponents: undefined,
						user: undefined,
						answer: undefined
					}
				} else if (
					component.componentTask.type === CourseComponentType.Quiz ||
					component.componentTask.type ===
					CourseComponentType.MultiPlayChoice ||
					component.componentTask.type ===
					CourseComponentType.SimpleTask
				) {
					// Создаем новый объект, чтобы оставить оригинальную сущность нетронутой
					const { id, title, description, type } =
						component.componentTask
					component.componentTask = {
						id,
						title,
						description,
						type,
						userAnswer: component.componentTask.userAnswer,
						content_description:
							component.componentTask.content_description,
						questions: component.componentTask.questions,
						created_at: undefined,
						status: undefined,
						tags: undefined,
						sort: undefined,
						sectionComponents: undefined,
						user: undefined,
						answer: undefined
					}
				}

				if (Array.isArray(component.componentTask.questions)) {
					// Удаляем correctAnswer у каждого вопроса
					component.componentTask.questions =
						component.componentTask.questions.map(question => {
							const { correctOption, ...rest } = question // Деструктурируем и исключаем correctAnswer
							return rest // Возвращаем объект без correctAnswer
						})
				}
			}
		})

		console.log('!!!!!!!!!!!!', userAnswersMap)

		return {
			id: currentSection.id,
			name: currentSection.name,
			small_description: currentSection.description,
			components: sectionComponents,
			files: currentSection.uploadFile,
			links: [currentSection.externalLinks].map(it => it).filter(Boolean)
		}
	}
}
