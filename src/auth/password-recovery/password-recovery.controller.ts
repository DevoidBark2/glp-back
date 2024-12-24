import {
	Controller,
	Post,
	Body,
	Param,
	HttpCode,
	HttpStatus
} from '@nestjs/common'
import { PasswordRecoveryService } from './password-recovery.service'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { NewPasswordDto } from './dto/new-password.dto'

@Controller('password-recovery')
export class PasswordRecoveryController {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Recaptcha()
	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	public async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.reset(dto)
	}

	@Recaptcha()
	@Post('new-password/:token')
	@HttpCode(HttpStatus.OK)
	public async newPassword(
		@Body() dto: NewPasswordDto,
		@Param('token') token: string
	) {
		return this.passwordRecoveryService.newPassword(dto, token)
	}
}
