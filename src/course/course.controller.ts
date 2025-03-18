import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { CourseService } from './course.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../config/multerConfig'
import {
	ApiBody,
	ApiConsumes,
	ApiHeader,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger'
import { CreateCourseDto } from './dto/create_course.dto'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { EventLoggingInterceptor } from '../interceptors/event-logging.interceptor'
import { ChangeCourseDto } from './dto/change-course.dto'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { SubscribeCourseDto } from './dto/subsribe-course.dto'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { FilterValuesDto } from './dto/filter-options.dto'
import { SimpleAuthGuard } from '../decorators/simpleAuth.decorator'

@ApiTags('Курсы')
@UseInterceptors(EventLoggingInterceptor)
@Controller()
export class CourseController {
	constructor(private readonly courseService: CourseService) {}

	@Get('/courses')
	@ApiOperation({ summary: 'Get all courses' })
	async findAll() {
		return await this.courseService.findAll()
	}

	@Get('/course/:id')
	async getCourseById(@Param('id') id: number, @Req() req: Request) {
		return await this.courseService.findOneById(id, req['user'])
	}

	@UseGuards(SimpleAuthGuard)
	@Get('/courses/:id')
	async getPlatformCourseById(@Param('id') id: number, @Req() req: Request) {
		return await this.courseService.getPlatformCourseById(id, req['user'])
	}

	@Authorization()
	@Delete('delete-course-member')
	@ResponseMessage('Участник успешно удален!')
	async deleteCourseMember(@Query('id') id: number) {
		await this.courseService.deleteCourseMember(id)
	}

	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Post('/course')
	@UseInterceptors(FileInterceptor('image', multerOptions))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Create new post' })
	@ApiBody({ type: CreateCourseDto })
	// @LogAction(ActionEvent.CREATE_COURSE, 'A new course was created')
	@ApiHeader({
		name: 'authorization',
		description: 'Bearer Token',
		required: true
	})
	async createCourse(
		@Body() course: CreateCourseDto,
		@Req() req: Request,
		@UploadedFile() image: Express.Multer.File
	) {
		if (image) {
			course.image = 'uploads/' + image?.filename
		}
		const newCourse = await this.courseService.createCourse(
			course,
			req['user']
		)

		return {
			course: newCourse,
			message: 'Курс успешно создан!'
		}
	}

	@Get('get-courses')
	async getCoursesByCategory(@Query('categoryId') categoryId: number) {
		return await this.courseService.getCoursesByCategory(+categoryId)
	}

	@Get('search-courses')
	async getCoursesBySearch(@Query('search') search: string) {
		return await this.courseService.getCoursesBySearch(search)
	}

	@Post('search-course-by-filter')
	async getCoursesByFilter(@Body() body: FilterValuesDto) {
		return await this.courseService.searchCoursesByFilter(body)
	}

	@Authorization(UserRole.STUDENT, UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Get('/get-user-courses')
	async getUserCourses(@Req() req: Request) {
		try {
			return await this.courseService.getAllUserCourses(req['user'])
		} catch (e) {
			throw new BadRequestException(`Ошибка при получении данных: ${e}`)
		}
	}

	@Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Delete('/course/:id')
	@ResponseMessage('Курс успешно удален!')
	async deleteCourse(@Param('id') id: number) {
		await this.courseService.delete(id)
	}

	@Post('publish-course')
	@ResponseMessage(
		'Курс отправлен на проверку, ожидайте ответа от модератора'
	)
	async publishCourse(
		@Body() body: { courseId: number },
		@Req() req: Request
	) {
		return await this.courseService.publishCourse(body.courseId, req)
	}

	@Get('course-details/:id')
	async getCourseDetail(@Param('id') id: number) {
		return await this.courseService.getCourseDetails(id)
	}

	@Get('course-sections/:id')
	async getCourseSections(@Param('id') id: number) {
		return await this.courseService.getCourseSections(id)
	}

	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Put('/course')
	@ResponseMessage('Курс успешно обновлен!')
	async changeCourse(@Body() body: ChangeCourseDto, @Req() req: Request) {
		return this.courseService.changeCourse(body, req['user'])
	}

	@Authorization()
	@Get('/get-course-menu')
	async getFullCourse(
		@Query('courseId') courseId: number,
		@Req() req: Request
	) {
		return await this.courseService.getCourseMenuById(courseId, req['user'])
	}

	@Post('subscribe-course')
	async subscribeCourse(@Body() body: SubscribeCourseDto) {
		await this.courseService.subscribeCourse(body)
	}

	@Authorization()
	@Delete('/leave-course/:id')
	@ResponseMessage('Вы покинули курс.')
	async leaveFromCourse(@Param('id') id: number, @Req() req: Request) {
		return await this.courseService.leaveCourse(id, req['user'])
	}

	@Authorization()
	@Post('/update-step')
	async updateSectionStep(
		@Body() body: { prevSection: number; courseId: number },
		@Req() req: Request
	) {
		return await this.courseService.updateSectionStep(
			body.prevSection,
			body.courseId,
			req['user']
		)
	}

	@Authorization(
		UserRole.STUDENT,
		UserRole.TEACHER,
		UserRole.SUPER_ADMIN,
		UserRole.MODERATOR
	)
	@Get('/get-current-section')
	async getCurrentSectionStep(
		@Query('courseId') courseId: number,
		@Query('currentSection') currentSection: number,
		@Req() req: Request
	) {
		return await this.courseService.getCurrentSection(
			courseId,
			currentSection,
			req['user']
		)
	}

	@Authorization()
	@Get('/start-exam')
	async startExam(@Query('courseId') courseId: number, @Req() req: Request) {
		return await this.courseService.startExam(courseId, req['user'])
	}

	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Get('get-course-members')
	async getCourseMembers(@Query('courseId') courseId: number) {
		return await this.courseService.getCourseMembers(courseId)
	}

	@Get('popular-courses')
	async getAllPopularCourse() {
		return this.courseService.getAllPopularCourses()
	}

	@Post('/check-secret-key')
	async handleCheckSecretKey(
		@Body() body: { secret_key: string; courseId: number }
	) {
		return await this.courseService.handleCheckCourseSecretKey(
			body.secret_key,
			body.courseId
		)
	}
}
