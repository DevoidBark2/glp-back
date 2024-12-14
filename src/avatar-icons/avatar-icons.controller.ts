import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { AvatarIconsService } from './avatar-icons.service'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../config/multerConfig'
import { ApiConsumes, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ResponseMessage } from '../decorators/response-message.decorator'

@ApiTags('Аватар пользователя')
@Controller()
export class AvatarIconsController {
	constructor(private readonly avatarIconsService: AvatarIconsService) {}

	@Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Post('/avatar-icon')
	@UseInterceptors(FileInterceptor('image', multerOptions))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Create new avatar icon' })
	@ApiHeader({ name: 'authorization' })
	@ResponseMessage('Иконка успешно создана!')
	async createPost(@UploadedFile() image: Express.Multer.File) {
		try {
			return await this.avatarIconsService.createAvatarIcon(
				'uploads/' + image?.filename
			)
		} catch (e) {
			throw new BadRequestException(`Ошибка при создании аватарки: ${e}`)
		}
	}

	@Roles(
		UserRole.SUPER_ADMIN,
		UserRole.TEACHER,
		UserRole.STUDENT,
		UserRole.MODERATOR
	)
	@Get('/avatar-icons')
	async getAllAvatarIcons() {
		return this.avatarIconsService.getAll()
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Delete('/avatar-icons')
	@ResponseMessage('Иконка успешно удалена!')
	async deleteAvatarIcon(@Query('id') id: number) {
		await this.avatarIconsService.delete(id)
	}
}
