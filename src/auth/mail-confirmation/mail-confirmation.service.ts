import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Token } from '../entity/token.entity'
import { TokenType } from '../enum/token-type.enum'
import { Request } from 'express'
import { ConfirmationDTO } from './dto/confirmation.dto'
import { User } from '../../user/entity/user.entity'
import { MailService } from '../../libs/mail/mail.service'
import { UserService } from '../../user/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class MailConfirmationService {
	public constructor(
		@InjectRepository(Token)
		private readonly tokenRepository: Repository<Token>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	public async newVerification(req: Request, dto: ConfirmationDTO) {
		const existingToken = await this.tokenRepository.findOne({
			where: { token: dto.token, type: TokenType.VERIFICATION }
		})

		if (!existingToken) {
			throw new NotFoundException(`Token not found`)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(`Токен подтверждения истечен!`)
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException(`User not found, wrong email`)
		}

		await this.userRepository.update(existingUser.id, {
			isVerified: true
		})

		await this.tokenRepository.delete({
			id: existingToken.id,
			type: TokenType.VERIFICATION
		})

		return this.authService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenRepository.findOne({
			where: { email: email, type: TokenType.VERIFICATION }
		})

		if (existingToken) {
			await this.tokenRepository.delete(existingToken.id)
		}

		return await this.tokenRepository.save({
			id: uuidv4(),
			email: email,
			token: token,
			expiresIn: expiresIn,
			type: TokenType.VERIFICATION
		})
	}
}
