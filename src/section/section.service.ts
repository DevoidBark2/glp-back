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
						course: true,
						user: true,
						sectionComponents: true
					},
					select: {
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
						course: true,
						sectionComponents: true
					}
				})
	}

	async createSection(section: CreateSectionCourseDto, user: User) {
		console.log(section)
		const parentSection = section.parentSection
			? await this.mainSectionRepository.findOne({
					where: { id: Number(section.parentSection) }
				})
			: null

		const course = await this.courseEntityRepository.findOne({
			where: { id: Number(section.course) }
		})

		const sectionItem = await this.sectionEntityRepository.save({
			name: section.name,
			description: section.description,
			course: course,
			externalLinks: section.externalLinks,
			uploadFile: section.uploadFile,
			user: user,
			status: StatusSectionEnum.ACTIVE,
			parentSection: parentSection
		})

		const componentIdsString = section.components // "20,18"

		const componentIdsArray = componentIdsString.split(',').map(id => id)

		await Promise.all(
			componentIdsArray.map(async (componentId, index) => {
				// Получаем компонент по ID из базы данных
				const componentTask =
					await this.componentTaskRepository.findOne({
						where: {
							id: componentId // Уже преобразовано в число
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
				sectionComponents: true
			}
		})

		if (!section) {
			throw new BadRequestException(`Раздел с ID ${id} не найден!`)
		}

		return section
	}

	async getMainSection(user: User) {
		return user.role === UserRole.SUPER_ADMIN
			? await this.mainSectionRepository.find()
			: await this.mainSectionRepository.find({
					where: {
						user: user
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
}
