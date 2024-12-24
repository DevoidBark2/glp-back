import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { MailService } from '../../libs/mail/mail.service'
import { v4 as uuidv4 } from 'uuid'
import { TokenType } from '../enum/token-type.enum'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '../entity/token.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly mailService: MailService,
		@InjectRepository(Token)
		private readonly tokenRepository: Repository<Token>
	) {}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.tokenRepository.findOne({
			where: { email, type: TokenType.TWO_FACTORY }
		})

		if (!existingToken) {
			throw new NotFoundException(`Token two-factor not found`)
		}

		if (existingToken.token !== code) {
			throw new BadRequestException('Неверный код')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				`Токен двухфакторной авторизации истечен!`
			)
		}

		await this.tokenRepository.delete(existingToken.id)

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)

		await this.mailService.sendTwoFactorEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()

		// 15 минут
		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.tokenRepository.findOne({
			where: { email: email, type: TokenType.TWO_FACTORY }
		})

		if (existingToken) {
			await this.tokenRepository.delete(existingToken.id)
		}

		return await this.tokenRepository.save({
			id: uuidv4(),
			email: email,
			token: token,
			expiresIn: expiresIn,
			type: TokenType.TWO_FACTORY
		})
	}
}
