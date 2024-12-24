import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { MailService } from '../../libs/mail/mail.service'
import { v4 as uuidv4 } from 'uuid'
import { TokenType } from '../enum/token-type.enum'
import { InjectRepository } from '@nestjs/typeorm'
import { Token } from '../entity/token.entity'
import { Repository } from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { NewPasswordDto } from './dto/new-password.dto'
import { hash } from 'argon2'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly userService: UserService,
		private readonly mailService: MailService,
		@InjectRepository(Token)
		private readonly tokenRepository: Repository<Token>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	public async reset(dto: ResetPasswordDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: dto.email }
		})

		if (!existingUser) {
			throw new NotFoundException(
				`Пользователь не найден, Проверьте email`
			)
		}

		const passwordResetToken = await this.generatePasswordResetToken(
			existingUser.email
		)

		await this.mailService.sendPasswordResetEmail(
			passwordResetToken.email,
			passwordResetToken.token
		)

		return true
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.tokenRepository.findOne({
			where: { token, type: TokenType.PASSWORD_RESET }
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Токен истек')
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException(`User not found, wrong email`)
		}

		await this.userRepository.update(existingUser.id, {
			password: await hash(dto.password)
		})

		await this.tokenRepository.delete(existingToken.id)

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenRepository.findOne({
			where: { email: email, type: TokenType.PASSWORD_RESET }
		})

		if (existingToken) {
			await this.tokenRepository.delete(existingToken.id)
		}

		return await this.tokenRepository.save({
			id: uuidv4(),
			email: email,
			token: token,
			expiresIn: expiresIn,
			type: TokenType.PASSWORD_RESET
		})
	}
}
