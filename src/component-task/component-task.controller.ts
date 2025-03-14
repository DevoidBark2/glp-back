import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req
} from '@nestjs/common'
import { ComponentTaskService } from './component-task.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateComponentTaskDto } from './dto/create-component-task.dto'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { SaveTaskUserDto } from './dto/save-task-user.dto'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { ChangeComponentOrderDto } from './dto/change-component-order.dto'

@ApiTags('Компоненты раздела')
@Controller('')
export class ComponentTaskController {
	constructor(private readonly componentTaskService: ComponentTaskService) {}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('/components')
	async getComponentTask(@Req() req: Request) {
		return await this.componentTaskService.getAll(req['user'])
	}

	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('/component-task/:id')
	async getComponentTaskById(@Param('id') id: string) {
		return await this.componentTaskService.getComponentById(id)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('/components')
	async createComponentTask(
		@Body() body: CreateComponentTaskDto,
		@Req() req: Request
	) {
		const component = await this.componentTaskService.create(
			body,
			req['user']
		)

		return {
			message: 'Компонент успешно создан!',
			component: component
		}
	}

	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Put('/component-task')
	@ResponseMessage('Компонент успешно обновлен!')
	async changeComponentTask(
		@Req() req: Request,
		@Body() body: CreateComponentTaskDto
	) {
		return await this.componentTaskService.change(body, req['user'])
	}

	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Delete('/component-task/:id')
	@ResponseMessage('Компонент успешно удален!')
	async deleteComponentTask(@Param('id') id: string, @Req() req: Request) {
		return await this.componentTaskService.delete(id, req['user'])
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('/search-components')
	async getSearchComponents(
		@Query('query') query: string,
		@Req() req: Request
	) {
		return await this.componentTaskService.searchComponent(
			query,
			req['user']
		)
	}

	@Authorization()
	@Post('save-task-user')
	async saveUserTask(@Body() body: SaveTaskUserDto, @Req() req: Request) {
		return await this.componentTaskService.addAnswerForTask(
			body,
			req['user']
		)
	}

	@Authorization()
	@Post('submit-exam-user')
	async submitExamUser(
		@Query('courseId') courseId: string,
		@Req() req: Request
	) {
		return await this.componentTaskService.submitExamUser(
			courseId,
			req['user']
		)
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Post('change-order-component')
	async changeComponentOrder(
		@Body() body: ChangeComponentOrderDto,
		@Req() req: Request
	) {
		return await this.componentTaskService.changeComponentOrder(
			body,
			req['user']
		)
	}
}
