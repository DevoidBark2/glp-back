import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req
} from '@nestjs/common'
import { MailConfirmationService } from './mail-confirmation.service'
import { ConfirmationDTO } from './dto/confirmation.dto'
import { Request } from 'express'

@Controller('email-confirmation')
export class MailConfirmationController {
	constructor(
		private readonly mailConfirmationService: MailConfirmationService
	) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	public async newVerification(
		@Req() req: Request,
		@Body() dto: ConfirmationDTO
	) {
		return this.mailConfirmationService.newVerification(req, dto)
	}
}
