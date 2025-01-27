import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { ExamsService } from './exams.service'
import { ApiTags } from '@nestjs/swagger'
import { Authorization } from '../auth/decorators/auth.decorator'
import { UserRole } from '../constants/contants'
import { CreateExamDto } from './dto/create-exam.dto'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { SetExamForCourseDto } from './dto/set-exam-for-course.dto'

@ApiTags('Экзамен')
@Controller('')
export class ExamsController {
	constructor(private readonly examsService: ExamsService) { }

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('exams')
	async getUserExams(@Req() req: Request) {
		return await this.examsService.findAll(req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('exams')
	@ResponseMessage('Экзамен успешно создан!')
	async createExam(@Body() body: CreateExamDto, @Req() req: Request) {
		return await this.examsService.createExam(body, req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Delete('exams/:id')
	@ResponseMessage('Экзамен успешно удален!')
	async deleteExam(@Param('id') id: number, @Req() req: Request) {
		return await this.examsService.deleteExam(id, req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Put('set-exam-course')
	@ResponseMessage("Экзамен успешно установлен")
	async setExamForCourse(@Body() body: SetExamForCourseDto) {
		await this.examsService.setExamForCourse(body);
	}
}
