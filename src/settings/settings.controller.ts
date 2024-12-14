import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Put,
	Req
} from '@nestjs/common'
import { SettingsService } from './settings.service'
import {
	ApiBody,
	ApiHeader,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger'
import { ChangeUserSettingsDto } from './dto/change_user_settings.dto'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { SettingsResponseDto } from './dto/settings_response.dto'

@ApiTags('Settings')
@Controller()
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Roles(UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.TEACHER)
	@Get('/user-settings')
	@ApiHeader({
		name: 'authorization',
		description: 'Authorization token',
		required: true
	})
	@ApiOperation({ summary: 'Get user settings' })
	@ApiOkResponse({
		status: HttpStatus.OK,
		type: SettingsResponseDto
	})
	async getUserSettings(@Req() req: Request) {
		const userSettings = await this.settingsService.getUserSettings(req)

		return {
			userSettings: userSettings
		}
	}

	@Roles(UserRole.SUPER_ADMIN, UserRole.STUDENT, UserRole.TEACHER)
	@Put('/user-settings')
	@ApiHeader({ name: 'authorization', description: 'Authorization token' })
	@ApiBody({ type: ChangeUserSettingsDto })
	@ApiOperation({ summary: 'Change user settings' })
	async changeUserSettings(@Body() userSettings: ChangeUserSettingsDto) {
		const updatedSettings =
			await this.settingsService.changeUserSettings(userSettings)

		return {
			updatedSettings: updatedSettings,
			message: 'Данные успешно сохранены!'
		}
	}

	@Roles(UserRole.TEACHER, UserRole.STUDENT)
	@Post('/user-settings/reset')
	@ApiOperation({ summary: 'Reset settings for user' })
	async resetUserSettings(@Req() req: Request) {
		await this.settingsService.resetUserSettings(req)

		return {
			message: 'Настройки успешно сброшены!'
		}
	}
}
