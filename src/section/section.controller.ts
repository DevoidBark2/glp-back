import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { SectionService } from './section.service'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { CreateSectionCourseDto } from './dto/create_section_course.dto'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { MainSectionDto } from './dto/create-main-section.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { fileOptions } from '../config/fileOption'
import { Authorization } from '../auth/decorators/auth.decorator'
import { ChangeSectionCourseDto } from './dto/change_section_course.dto'

@ApiTags('Разделы курсов')
@Controller()
export class SectionController {
	constructor(private readonly sectionService: SectionService) {}

	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Get('/sections')
	async getAllSectionCourse(@Req() req: Request) {
		return await this.sectionService.findAll(req['user'])
	}

	@Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Get('/sections/:id')
	async getSectionCourseById(@Param('id') id: number) {
		return await this.sectionService.findById(id)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('/sections')
	@UseInterceptors(FilesInterceptor('uploadFile', 10, fileOptions))
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: CreateSectionCourseDto })
	@ResponseMessage('Раздел успешно создан!')
	async createSectionCourse(
		@Body() newSectionCourse: CreateSectionCourseDto,
		@Req() req: Request,
		@UploadedFiles() images: Express.Multer.File[]
	) {
		console.log(images)
		if (typeof newSectionCourse.course === 'string') {
			newSectionCourse.course = JSON.parse(newSectionCourse.course)
		}
		if (typeof newSectionCourse.externalLinks === 'string') {
			newSectionCourse.externalLinks = JSON.parse(
				newSectionCourse.externalLinks
			)
		}
		if (!newSectionCourse.uploadFile) {
			newSectionCourse.uploadFile = []
		}
		images.forEach((file: Express.Multer.File) => {
			newSectionCourse.uploadFile.push({
				filePath: 'uploads/' + file.filename,
				fileName: file.originalname
			})
		})
		await this.sectionService.createSection(newSectionCourse, req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Put('/sections')
	@UseInterceptors(FilesInterceptor('uploadFile', 10, fileOptions))
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: CreateSectionCourseDto })
	@ResponseMessage('Раздел успешно обновлен!')
	async changeSectionCourse(
		@Body() sectionCourse: ChangeSectionCourseDto,
		@Req() req: Request
		//s@UploadedFiles() images: Express.Multer.File[]
	) {
		// if (!newSectionCourse.uploadFile) {
		// 	newSectionCourse.uploadFile = []
		// }
		// images.forEach((file: Express.Multer.File) => {
		// 	newSectionCourse.uploadFile.push({
		// 		filePath: 'uploads/' + file.filename,
		// 		fileName: file.originalname // Оригинальное имя файла от пользователя
		// 	})
		// })
		await this.sectionService.changeSection(sectionCourse, req['user'])
	}

	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Delete('/sections/:id')
	@ResponseMessage('Раздел успешно удален!')
	async deleteSectionCourse(@Param('id') id: number) {
		await this.sectionService.deleteSection(id)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('main-section')
	async getMainSections(@Req() req: Request) {
		return await this.sectionService.getMainSection(req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('main-section')
	@ResponseMessage('Раздел успешно создан!')
	async createMainSections(
		@Body() body: MainSectionDto,
		@Req() req: Request
	) {
		return await this.sectionService.createMainSections(body, req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('update-order-parent-section')
	async updateOrderParentSection(
		@Body()
		body: {
			sections: { id: number; sort: number; sectionId: number }[]
			courseId: number
		}
	) {
		return await this.sectionService.updateOrderParentSection(body)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('update-order-section')
	async updateOrderSection(
		@Body()
		body: {
			courseId: number
			parentId: number
			sections: { id: number; sort: number }[]
		}
	) {
		return await this.sectionService.updateOrderSection(body)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Delete('delete-parent-section/:parentId')
	@ResponseMessage('Курс обновлен.')
	async deleteParentSection(
		@Param('parentId') parentId: number,
		@Query('courseId') courseId: number
	) {
		return await this.sectionService.deleteParentSection(parentId, courseId)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Delete('delete-section/:sectionId')
	@ResponseMessage('Курс обновлен.')
	async deleteSection(
		@Param('sectionId') sectionId: number,
		@Query('courseId') courseId: number
	) {
		return await this.sectionService.deleteSectionInCourse(
			sectionId,
			courseId
		)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Delete('delete-component-section/:componentId')
	@ResponseMessage('Курс обновлен.')
	async deleteSectionComponent(
		@Param('componentId') componentId: string,
		@Query('courseId') courseId: number
	) {
		return await this.sectionService.deleteSectionComponent(
			componentId,
			courseId
		)
	}
}
