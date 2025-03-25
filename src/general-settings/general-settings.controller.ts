import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseInterceptors
} from '@nestjs/common'
import { GeneralSettingsService } from './general-settings.service'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { ApiTags } from '@nestjs/swagger'
import { ChangeGeneralSettingsDto } from './dto/change-general-settings.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/config/multerConfig'
import { ResponseMessage } from '../decorators/response-message.decorator'

@ApiTags('Основные настройки')
@Controller()
export class GeneralSettingsController {
	constructor(
		private readonly generalSettingsService: GeneralSettingsService
	) {}

	@Get('/general-settings')
	async getGeneralSettings() {
		return this.generalSettingsService.getAll()
	}

	@Get('footer')
	async getFooterInfo() {
		return this.generalSettingsService.getFooterInfo()
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Post('/general-settings')
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'logo_url', maxCount: 1 },
				{ name: 'default_avatar', maxCount: 1 }
			],
			multerOptions
		)
	)
	@ResponseMessage('Настройки успешно обновлены!')
	async changeGeneralSettings(
		@Body() settings: ChangeGeneralSettingsDto,
		@UploadedFiles()
		files: {
			logo_url?: Express.Multer.File[]
			default_avatar?: Express.Multer.File[]
		}
	) {
		settings.logo_url = null
		settings.default_avatar = null

		if (files.logo_url && files.logo_url.length > 0) {
			settings.logo_url = `uploads/${files.logo_url[0].filename}`
		}

		if (files.default_avatar && files.default_avatar.length > 0) {
			settings.default_avatar = `uploads/${files.default_avatar[0].filename}`
		}

		await this.generalSettingsService.change(settings)
	}
}
