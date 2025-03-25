import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '../user/entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SectionEntity } from './entity/section.entity'
import { CreateSectionCourseDto } from './dto/create_section_course.dto'
import { StatusSectionEnum } from './enum/status_section.enum'
import { MainSection } from './entity/main-section.entity'
import { MainSectionDto } from './dto/create-main-section.dto'
import { SectionComponentTask } from './entity/section-component-task.entity'
import { CourseEntity } from '../course/entity/course.entity'
import { ComponentTask } from '../component-task/entity/component-task.entity'
import { UserRole } from '../constants/contants'
import { ChangeSectionCourseDto } from './dto/change_section_course.dto'

@Injectable()
export class SectionService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(SectionComponentTask)
		private readonly sectionComponentTaskRepository: Repository<SectionComponentTask>,
		@InjectRepository(MainSection)
		private readonly mainSectionRepository: Repository<MainSection>,
		@InjectRepository(SectionEntity)
		private readonly sectionEntityRepository: Repository<SectionEntity>,
		@InjectRepository(CourseEntity)
		private readonly courseEntityRepository: Repository<CourseEntity>,
		@InjectRepository(ComponentTask)
		private readonly componentTaskRepository: Repository<ComponentTask>
	) {}
	async findAll(user: User) {
		return user.role === UserRole.SUPER_ADMIN
			? this.sectionEntityRepository.find({
					relations: {
						user: true,
						course: true
					},
					select: {
						id: true,
						name: true,
						course: {
							id: true,
							name: true
						},
						created_at: true,
						status: true,
						user: {
							id: true,
							first_name: true,
							second_name: true,
							last_name: true,
							role: true
						}
					}
				})
			: this.sectionEntityRepository.find({
					where: { user: { id: user.id } },
					relations: {
						course: true
					},
					select: {
						id: true,
						name: true,
						course: {
							id: true,
							name: true
						},
						created_at: true,
						status: true,
						user: {
							id: true,
							first_name: true,
							second_name: true,
							last_name: true,
							role: true
						}
					}
				})
	}

	async createSection(section: CreateSectionCourseDto, user: User) {
		const parentSection = section.parentSection
			? await this.mainSectionRepository.findOne({
					where: { id: Number(section.parentSection) }
				})
			: null

		const course = await this.courseEntityRepository.findOne({
			where: { id: Number(section.course.id) }
		})

		let sortNumber = 0

		if (parentSection) {
			const lastSection = await this.sectionEntityRepository.find({
				order: { sort_number: 'DESC' }
			})

			console.log(lastSection)

			sortNumber =
				lastSection.length > 0
					? Number(lastSection[0].sort_number) + 1
					: 0
		}

		const sectionItem = await this.sectionEntityRepository.save({
			name: section.name,
			description: section.description,
			course: course,
			externalLinks: section.externalLinks,
			uploadFile: section.uploadFile,
			user: user,
			status: StatusSectionEnum.ACTIVE,
			parentSection: parentSection,
			sort_number: sortNumber // Присваиваем правильный порядок
		})

		await Promise.all(
			section.components.map(async (component, index) => {
				// Получаем компонент по ID из базы данных
				const componentTask =
					await this.componentTaskRepository.findOne({
						where: {
							id: component.id // Уже преобразовано в число
						}
					})

				// Сохраняем связанный компонент задачи для секции
				if (componentTask) {
					await this.sectionComponentTaskRepository.save({
						section: sectionItem,
						componentTask: componentTask,
						sort: index
					})
				}
			})
		)
	}

	async changeSection(section: ChangeSectionCourseDto, user: User) {
		console.log(section)
		// Находим существующий раздел
		const sectionItem = await this.sectionEntityRepository.findOne({
			where: { id: Number(section.id) },
			relations: ['course', 'parentSection'] // Загружаем связанные данные
		})

		if (!sectionItem) {
			throw new Error('Раздел не найден')
		}

		// Если передан родительский раздел, получаем его
		const parentSection = section.parentSection
			? await this.mainSectionRepository.findOne({
					where: { id: Number(section.parentSection) }
				})
			: null

		// Получаем курс
		const course = await this.courseEntityRepository.findOne({
			where: { id: Number(section.course.id) }
		})

		if (!course) {
			throw new Error('Курс не найден')
		}

		// Обновляем данные раздела
		Object.assign(sectionItem, {
			name: section.name,
			description: section.description,
			course: course,
			externalLinks: section.externalLinks,
			uploadFile: section.uploadFile,
			parentSection: parentSection
		})

		// Сохраняем обновленный раздел
		await this.sectionEntityRepository.save(sectionItem)

		// Удаляем старые связи компонентов с этим разделом
		await this.sectionComponentTaskRepository.delete({
			section: sectionItem
		})

		// Добавляем новые компоненты
		await Promise.all(
			section.components.map(async (component, index) => {
				const componentTask =
					await this.componentTaskRepository.findOne({
						where: { id: component.id }
					})

				if (componentTask) {
					await this.sectionComponentTaskRepository.save({
						section: sectionItem,
						componentTask: componentTask,
						sort: index
					})
				}
			})
		)

		return sectionItem
	}

	async deleteSection(id: number) {
		const section = await this.sectionEntityRepository.findOne({
			where: { id: id }
		})

		if (!section) {
			throw new BadRequestException(`Раздел с ID ${id} не найден!`)
		}

		await this.sectionEntityRepository.delete(id)
	}

	async findById(id: number) {
		const section = await this.sectionEntityRepository.findOne({
			where: { id: id },
			relations: {
				course: true,
				sectionComponents: {
					componentTask: true
				},
				parentSection: true
			},
			order: {
				sectionComponents: {
					sort: 'ASC'
				}
			}
		})

		if (!section) {
			throw new BadRequestException(`Раздел с ID ${id} не найден!`)
		}

		return {
			id: section.id,
			course: {
				id: section.course.id,
				name: section.course.name
			},
			name: section.name,
			description: section.description,
			uploadFile: section.uploadFile,
			status: section.status,
			sectionComponents: section.sectionComponents.map(component => {
				return {
					id: component.id,
					componentTask: {
						id: component.componentTask.id,
						title: component.componentTask.title,
						type: component.componentTask.type
					}
				}
			}),
			created_at: section.created_at,
			externalLinks: section.externalLinks,
			parentSection: section.parentSection.id
		}
	}

	async getMainSection(user: User) {
		return await this.mainSectionRepository.find({
			where: {
				user: { id: user.id }
			}
		})
	}

	async createMainSections(body: MainSectionDto, user: User) {
		const section = await this.mainSectionRepository.save({
			...body,
			user: user
		})

		return {
			id: section.id,
			title: section.title
		}
	}

	async updateOrderParentSection(body: {
		sections: { id: number; sort: number; sectionId: number }[]
		courseId: number
	}) {
		for (const section of body.sections) {
			const sectionItem = await this.sectionEntityRepository.findOne({
				where: {
					id: Number(section.sectionId)
				},
				relations: {
					parentSection: true
				}
			})
			await this.mainSectionRepository.update(
				sectionItem.parentSection.id,
				{
					sort: section.sort
				}
			)
		}
	}

	async updateOrderSection(body: {
		courseId: number
		parentId: number
		sections: { id: number; sort: number }[]
	}) {
		console.log(body)
		for (const section of body.sections) {
			await this.sectionEntityRepository.update(section.id, {
				sort_number: section.sort
			})
		}
	}

	async deleteParentSection(parentId: number, courseId: number) {
		await this.sectionEntityRepository.delete({
			course: { id: courseId },
			parentSection: { id: parentId }
		})
	}

	async deleteSectionInCourse(sectionId: number, courseId: number) {
		await this.sectionEntityRepository.delete({
			id: sectionId,
			course: { id: courseId }
		})
	}

	async deleteSectionComponent(componentId: string, sectionId: number) {
		await this.sectionComponentTaskRepository.delete({
			componentTask: { id: componentId },
			section: { id: sectionId }
		})
	}
}
