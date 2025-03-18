import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CourseEntity } from './entity/course.entity'
import { Between, ILike, In, LessThan, MoreThan, Repository } from 'typeorm'
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
import { ExamEntity } from '../exams/entity/exam.entity'
import { FilterType, FilterValuesDto } from './dto/filter-options.dto'
import { ExamUsers } from '../exams/entity/exam-users.entity'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { ExamUsersAnswerEntity } from '../exams/entity/exam-users-answer.entity'

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
		private readonly sectionRepository: Repository<SectionEntity>,
		@InjectRepository(ExamEntity)
		private readonly examEntityRepository: Repository<ExamEntity>,
		@InjectRepository(ExamUsers)
		private readonly examUsersRepository: Repository<ExamUsers>,
		@InjectRepository(ExamUsersAnswerEntity)
		private readonly examUsersAnswerEntityRepository: Repository<ExamUsersAnswerEntity>,
		@InjectQueue('examQueue') private readonly examQueue: Queue
	) {}

	async findAll() {
		return await this.courseEntityRepository.find({
			where: {
				status: StatusCourseEnum.ACTIVE
			},
			relations: {
				category: true
			},
			select: {
				id: true,
				name: true,
				image: true
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
				name: ILike(`%${searchKeywords.join('%')}%`) // Ищем по названию курса
				// user: {
				// 	first_name: ILike(`%${searchKeywords.join('%')}%`), // Ищем по имени пользователя
				// 	last_name: ILike(`%${searchKeywords.join('%')}%`), // Ищем по фамилии пользователя
				// 	second_name: ILike(`%${searchKeywords.join('%')}%`) // Ищем по отчеству пользователя
				// }
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

	async searchCoursesByFilter(filters: FilterValuesDto) {
		const whereConditions: any = {}

		if (filters.searchString) {
			whereConditions.name = ILike(`%${filters.searchString}%`)
		}

		if (filters.levels && filters.levels.length > 0) {
			const levelValues = filters.levels.map(level => Number(level)) // Преобразуем в число
			whereConditions.level = In(levelValues)
		}

		// Фильтрация по продолжительности
		if (filters.durations && filters.durations.length > 0) {
			filters.durations.forEach(duration => {
				if (
					duration.type === FilterType.LESS &&
					typeof duration.value === 'number'
				) {
					whereConditions['duration'] = LessThan(duration.value)
				} else if (
					duration.type === FilterType.RANGE &&
					typeof duration.value === 'object'
				) {
					whereConditions['duration'] = Between(
						duration.value.min,
						duration.value.max
					)
				} else if (
					duration.type === FilterType.GREATER &&
					typeof duration.value === 'number'
				) {
					whereConditions['duration'] = MoreThan(duration.value)
				}
			})
		}

		// Сортировка по заданным условиям
		const orderConditions: any = {}
		if (filters.sortOption) {
			const sortOption = filters.sortOption.value
			if (sortOption === 'newest') {
				orderConditions['publish_date'] = 'DESC'
			}
			if (sortOption === 'rating') {
			}
		}

		// Запрос с фильтрацией и сортировкой
		return await this.courseEntityRepository.find({
			where: {
				...whereConditions,
				category: In(filters.categories)
				// level: In(filters.levels)
			},
			order: orderConditions,
			relations: {
				category: true,
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

	async findOneById(courseId: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				category: true,
				user: true,
				exam: true,
				sections: true
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
				secret_key: true,
				category: {
					id: true,
					name: true
				},
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true,
					profile_url: true,
					method_auth: true
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
		const isUserEnrolled = await this.courseUserRepository.findOne({
			where: {
				user: { id: user.id },
				course: { id: courseId }
			}
		})

		// Return the course with the additional `isUserEnrolled` field
		return {
			...course,
			isUserEnrolled: !!isUserEnrolled
		}
	}

	async getPlatformCourseById(courseId: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				category: true,
				user: true,
				exam: true,
				sections: true
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
				secret_key: true,
				category: {
					id: true,
					name: true
				},
				user: {
					id: true,
					first_name: true,
					second_name: true,
					last_name: true,
					profile_url: true,
					method_auth: true
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
		const isUserEnrolled = await this.courseUserRepository.findOne({
			where: {
				user: { id: user.id },
				course: { id: courseId }
			}
		})

		// Return the course with the additional `isUserEnrolled` field
		return {
			...course,
			isUserEnrolled: !!isUserEnrolled
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

	async deleteCourseMember(id: number) {
		const data = await this.courseUserRepository.findOne({
			where: {
				id: id
			},
			relations: {
				user: true
			}
		})

		await this.answersComponentUserRepository.delete({ user: data.user })
		await this.courseUserRepository.delete({ id: data.id })
	}

	async createCourse(createCourse: CreateCourseDto, currentUser: User) {
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
						user: true,
						category: true
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
						user: true,
						category: true
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

		// if (course.status === StatusCourseEnum.IN_PROCESSING) {
		// 	throw new BadRequestException(
		// 		'В данный момент курс в обработке, ожидайте ответа от модератора'
		// 	)
		// }

		// if (course.status === StatusCourseEnum.ACTIVE) {
		// 	throw new BadRequestException(
		// 		'Курс сейчас опубликован, его нельзя удалить!'
		// 	)
		// }

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

		return course
	}

	async getCourseSections(id: number) {
		return await this.sectionRepository.find({
			where: {
				course: { id: id }
			},
			relations: {
				parentSection: true,
				sectionComponents: {
					componentTask: true
				}
			},
			order: {
				sectionComponents: {
					sort: 'ASC'
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
			...course,
			category: category,
			user: user
		})
	}

	async getCourseMenuById(courseId: number, user: User) {
		const course = await this.loadCourse(courseId)
		if (!course) throw new Error(`Курс с ID ${courseId} не найден!`)

		const sections = course.sections
		if (!sections.length) return []

		const progress = await this.calculateUserProgress(user, courseId)

		const userAnswers = await this.loadUserAnswers(user.id, sections)
		const structuredSections = this.structureSections(sections, userAnswers)

		return {
			sections: structuredSections,
			courseName: course.name,
			progress
		}
	}

	private async loadCourse(courseId: number) {
		return this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				courseUsers: true,
				sections: {
					parentSection: true,
					sectionComponents: { componentTask: true }
				}
			},
			order: {
				sections: {
					parentSection: { sort: 'ASC' },
					sort_number: 'ASC'
				}
			}
		})
	}

	private async loadUserAnswers(userId: string, sections: SectionEntity[]) {
		const sectionIds = sections.map(section => section.id)
		return this.answersComponentUserRepository.find({
			where: {
				user: { id: userId },
				section: { id: In(sectionIds) }
			},
			relations: { section: true, task: true }
		})
	}

	private structureSections(
		sections: SectionEntity[],
		userAnswers: AnswersComponentUser[]
	) {
		const userAnswersMap = new Map(
			userAnswers.map(answer => [answer.section.id, answer.answer])
		)
		const mainSections = new Map<number, any>()
		const rootSections: any[] = []

		sections.forEach(section => {
			const userAnswer = this.processUserAnswer(
				userAnswersMap.get(section.id)
			)
			if (section.parentSection) {
				const parentId = section.parentSection.id
				if (!mainSections.has(parentId)) {
					mainSections.set(parentId, {
						id: parentId,
						name: section.parentSection.title,
						children: []
					})
				}
				mainSections.get(parentId).children.push({
					id: section.id,
					name: section.name,
					userAnswer
				})
			} else {
				rootSections.push({
					id: section.id,
					name: section.name,
					userAnswer,
					children: []
				})
			}
		})

		return [...mainSections.values(), ...rootSections]
	}

	/**
	 * Функция вычисления прогресса пользователя в курсе
	 * @param user - Пользователь
	 * @param course - Курс, в которsом нужно узнать прогресс
	 * @returns Прогресс в процентах (от 0 до 100)
	 */
	public async calculateUserProgress(
		user: User,
		courseId: number
	): Promise<number> {
		const course = await this.courseEntityRepository.findOne({
			where: {
				id: courseId
			},
			relations: {
				sections: {
					sectionComponents: {
						componentTask: true
					}
				}
			}
		})
		if (!course || !course.sections.length) return 0

		const totalPoints = this.calculateTotalPoints(course.sections)
		if (totalPoints === 0) return 0

		const userAnswers = await this.loadUserAnswers(user.id, course.sections)
		const userPoints = this.calculateTotalUserPoints(userAnswers)

		return Math.floor((userPoints / totalPoints) * 100)
	}

	private processUserAnswer(rawAnswer: any) {
		if (!rawAnswer) return null
		return rawAnswer.confirmedStep
			? { confirmedStep: rawAnswer.confirmedStep }
			: {
					totalAnswers: rawAnswer.length,
					correctAnswers: rawAnswer.filter(item => item.isCorrect)
						.length
				}
	}

	public calculateTotalPoints(sections: SectionEntity[]): number {
		let totalPoints = 0

		sections.forEach(section => {
			section.sectionComponents.forEach(it => {
				if (it.componentTask.type === CourseComponentType.Quiz) {
					totalPoints += it.componentTask.questions.length
				}

				if (
					it.componentTask.type ===
					CourseComponentType.MultiPlayChoice
				) {
					totalPoints += 3
				}

				if (it.componentTask.type === CourseComponentType.SimpleTask) {
					totalPoints += 4
				}
			})
		})

		return totalPoints
	}

	public calculateTotalUserPoints(
		userAnswers: AnswersComponentUser[] | ExamUsersAnswerEntity[]
	) {
		let total = 0

		userAnswers.map(it => {
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
				} else if (it.task.type === CourseComponentType.SimpleTask) {
					if (it.answer[0].isCorrect) {
						total += 4
					}
				}
			}
		})

		return total
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
				user: { id: user.id },
				course: { id: course.id }
			}
		})

		if (!course) {
			throw new BadRequestException(`Курс с ID ${id} не найден!`)
		}

		// Добавить удаление ответов на экзамен, когда появится

		await this.answersComponentUserRepository.delete({
			user: { id: user.id }
		})
		await this.courseUserRepository.delete(courseUser.id)
	}

	async updateSectionStep(
		prevSectionStep: number,
		courseId: number,
		user: User
	) {
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
				section: section,
				course: { id: courseId }
			})
		} catch (error) {
			console.error('Ошибка при сохранении записи:', error)
			throw new Error(
				'Ошибка при добавлении записи. Пожалуйста, попробуйте снова.'
			)
		}
	}

	async getCurrentSection(courseId: number, sectionId: number, user: User) {
		// Проверяем, если sectionId равен -1 (для проверки экзамена)
		if (Number(sectionId) === -1) {
			const userProgress = await this.calculateUserProgress(
				user,
				courseId
			)

			if (userProgress < 80) {
				return {
					success: false,
					message:
						'Экзамен сейчас не доступен, Вы не достигли минимального балла по прохождению курса, минимальный балл по курсу 80%'
				}
			}

			const examData = await this.examEntityRepository.findOne({
				where: { course: { id: courseId } },
				relations: { components: { componentTask: true }, exam: true },
				order: { components: { sort: 'ASC' } }
			})

			const userAnswers = await this.examUsersAnswerEntityRepository.find(
				{
					where: { user: { id: user.id } },
					relations: {
						task: true
					}
				}
			)

			const userExam = await this.examUsersRepository.findOne({
				where: {
					exam: { id: examData.id },
					user: { id: user.id }
				}
			})

			if (!userExam) {
				return {
					success: true,
					message:
						'Экзамен продлится 2 часа. Как только вы нажмёте «Начать», отсчёт времени запустится. Удачи!'
				}
			}

			const userAnswersMap = new Map(
				userAnswers
					.filter(answer => answer?.task?.id)
					.map(answer => [
						answer?.task.id,
						{ id: answer?.id, answer: answer?.answer }
					])
			)

			examData.components.forEach(component => {
				if (!component.componentTask) return

				const taskId = component.componentTask.id
				const userAnswerRecord = userAnswersMap.get(taskId)

				component.componentTask.userAnswer = userAnswerRecord
					? {
							...userAnswerRecord,
							courseUser: undefined,
							user: undefined,
							task: undefined,
							section: undefined,
							created_at: undefined
						}
					: null

				component.componentTask.questions?.forEach(it => {
					delete it.correctOption
				})

				!userExam.isEndExam &&
					component.componentTask.userAnswer?.answer.forEach(
						answer => {
							delete answer?.isCorrect
						}
					)
			})

			return {
				...examData,
				...(userExam.isEndExam
					? {
							success: userExam.progress > 75,
							message:
								userExam.progress > 75
									? '🎉 Поздравляем! Вы успешно завершили экзамен и получили сертификат. Вы можете скачать его в своём профиле.'
									: '😞 К сожалению, ваш результат ниже 75%. Не расстраивайтесь! Удача обязательно улыбнётся вам в следующий раз.'
						}
					: {})
			}
		}

		// Получаем курс с секциями и компонентами
		const course = await this.courseEntityRepository.findOne({
			where: { id: courseId },
			relations: {
				sections: { sectionComponents: { componentTask: true } }
			},
			order: { sections: { sectionComponents: { sort: 'ASC' } } }
		})

		if (!course) {
			throw new BadRequestException(
				`Course with ID ${courseId} not found`
			)
		}

		const currentSection = course.sections.find(
			section => section.id === sectionId
		)

		if (!currentSection) {
			throw new BadRequestException(
				`Section with ID ${sectionId} not found in course with ID ${courseId}`
			)
		}

		const sectionComponents = currentSection.sectionComponents

		const userAnswers = await this.answersComponentUserRepository.find({
			where: { user: { id: user.id }, section: { id: sectionId } },
			relations: ['task', 'section']
		})

		const userAnswersMap = new Map(
			userAnswers.map(answer => [
				`${answer.task ? answer.task.id : 'null'}-${answer.section.id}`,
				{ id: answer.id, answer: answer.answer }
			])
		)

		sectionComponents.forEach(component => {
			if (component.componentTask) {
				const taskId = component.componentTask.id
				const answerKey = `${taskId}-${sectionId}`
				const userAnswerRecord = userAnswersMap.get(answerKey)

				component.componentTask.userAnswer = userAnswerRecord
					? {
							...userAnswerRecord,
							courseUser: undefined,
							user: undefined,
							task: undefined,
							section: undefined,
							created_at: undefined
						}
					: null
				component.componentTask.questions?.forEach(it => {
					delete it.correctOption
				})
			}
		})

		return {
			id: currentSection.id,
			name: currentSection.name,
			small_description: currentSection.description,
			components: sectionComponents,
			files: currentSection.uploadFile,
			links: currentSection.externalLinks
				? [currentSection.externalLinks]
				: []
		}
	}

	async startExam(courseId: number, user: User) {
		const course = await this.courseEntityRepository.findOne({
			where: {
				id: courseId
			},
			relations: {
				exam: true
			}
		})

		const endExamAt = new Date()
		endExamAt.setHours(endExamAt.getHours() + 2)
		await this.examUsersRepository.save({
			user: user,
			exam: course.exam,
			endExamAt: endExamAt
		})

		const now = new Date()
		// const delayInMs = endExamAt.getTime() - now.getTime()
		const delayInMs = 20000

		await this.examQueue.add(
			'checkExam',
			{ userId: user.id, examId: course.exam.id, courseId: courseId },
			{ delay: delayInMs }
		)

		return await this.examEntityRepository.findOne({
			where: { course: { id: courseId } },
			relations: { components: { componentTask: true }, exam: true },
			order: {
				components: {
					sort: 'ASC'
				}
			}
		})
	}

	async getAllPopularCourses() {
		const courses = await this.courseEntityRepository.find({
			relations: {
				courseUsers: true,
				reviews: true,
				category: true // Убедимся, что категория загружается
			},
			select: {
				id: true,
				name: true,
				image: true,
				category: { id: true, name: true } // Выбираем только нужные поля категории
			}
		})

		// Фильтруем курсы, у которых есть подписчики
		const filteredCourses = courses.filter(
			course => course.courseUsers.length > 0
		)

		// Рассчитываем средний рейтинг и сортируем курсы
		// Берем топ-5
		return (
			filteredCourses
				.map(course => {
					const totalRating = course.reviews.reduce(
						(sum, review) => sum + review.rating,
						0
					)
					const averageRating = course.reviews.length
						? totalRating / course.reviews.length
						: 0
					return {
						id: course.id,
						name: course.name,
						image: course.image,
						category: course.category,
						subscribersCount: course.courseUsers.length,
						averageRating
					}
				})
				// Сортируем сначала по количеству подписчиков, затем по рейтингу
				.sort((a, b) => {
					if (b.subscribersCount !== a.subscribersCount) {
						return b.subscribersCount - a.subscribersCount
					}
					return b.averageRating - a.averageRating
				})
				.slice(0, 5)
		)
	}
	async handleCheckCourseSecretKey(secret_key: string, courseId: number) {
		const course = await this.courseEntityRepository.findOne({
			where: {
				id: courseId
			}
		})

		if (!course) {
			throw new BadRequestException(`Курс с ID ${courseId} не найден`)
		}

		if (course.secret_key !== secret_key) {
			throw new BadRequestException('Не верный код, попробуйте еще раз.')
		}

		return true
	}
}
