import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as argon2 from 'argon2'
import { verify } from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entity/user.entity'
import { RegisterUserDto } from './dto/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginDto } from './dto/login.dto'
import { UserRole } from '../constants/contants'
import { GeneralSettingsEntity } from 'src/general-settings/entity/general-settings.entity'
import { GeneralSettingsService } from 'src/general-settings/general-settings.service'
import { ComplexityPasswordEnum } from 'src/general-settings/enum/complexity-password.enum'
import { v4 as uuidv4 } from 'uuid'
import { AuthMethodEnum } from './enum/auth-method.enum'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ProviderService } from './provider/provider.service'
import { Account } from '../user/entity/account.entity'
import { MailConfirmationService } from './mail-confirmation/mail-confirmation.service'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'
import { EventEntity } from '../events/entity/event.entity'
import { ActionEvent } from '../events/enum/action-event.enum'
import { UsersLevelsService } from '../users-levels/users-levels.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly generalSettingsService: GeneralSettingsService,
		private readonly configService: ConfigService,
		private readonly mailConfirmationService: MailConfirmationService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(GeneralSettingsEntity)
		private readonly generalSettingsEntityRepository: Repository<GeneralSettingsEntity>,
		private readonly jwtService: JwtService,
		private readonly providerService: ProviderService,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		private readonly twoFactorService: TwoFactorAuthService,
		@InjectRepository(EventEntity)
		private readonly eventEntityRepository: Repository<EventEntity>,
		private readonly usersLevelsService: UsersLevelsService
	) {}

	// Метод для точного соответствия требованиям каждого уровня
	private checkPasswordComplexity(
		password: string,
		requiredComplexity: ComplexityPasswordEnum,
		minPasswordLength: number
	): void {
		// Сообщения по уровням сложности
		const complexityMessages = {
			[ComplexityPasswordEnum.LOW]: `Пароль должен содержать минимум ${minPasswordLength} символов.`,
			[ComplexityPasswordEnum.MEDIUM]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру.`,
			[ComplexityPasswordEnum.HIGH]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать заглавные и строчные буквы, цифры и хотя бы один специальный символ.`,
			[ComplexityPasswordEnum.VERY_HIGH]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать заглавные и строчные буквы, цифры и несколько специальных символов для повышенной безопасности.`
		}

		// Проверка для каждого уровня
		let isValid = false
		switch (requiredComplexity) {
			case ComplexityPasswordEnum.VERY_HIGH:
				isValid =
					/[A-Z]/.test(password) &&
					/[a-z]/.test(password) &&
					/\d/.test(password) &&
					/[^A-Za-z0-9]/.test(password) &&
					password.length >= minPasswordLength
				break
			case ComplexityPasswordEnum.HIGH:
				isValid =
					/[A-Z]/.test(password) &&
					/[a-z]/.test(password) &&
					/\d/.test(password) &&
					/[^A-Za-z0-9]/.test(password) &&
					password.length >= minPasswordLength
				break
			case ComplexityPasswordEnum.MEDIUM:
				isValid =
					/[A-Z]/.test(password) &&
					/[a-z]/.test(password) &&
					/\d/.test(password) &&
					password.length >= minPasswordLength
				break
			case ComplexityPasswordEnum.LOW:
				isValid = password.length >= minPasswordLength
				break
		}

		if (!isValid) {
			throw new BadRequestException(
				complexityMessages[requiredComplexity]
			)
		}
	}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByEmail(email)
		if (!user) {
			throw new BadRequestException(
				'Email или пароль не верные, попробуйте еще раз!'
			)
		}

		const generalSettings =
			await this.generalSettingsEntityRepository.find()
		const lockPeriodMinutes = generalSettings[0]?.lockout_duration || 30
		const maxLoginAttempts = generalSettings[0]?.max_login_attempts || 5

		await this.checkUserLock(user)

		const passwordIsMatch = await argon2.verify(user.password, password)

		if (!passwordIsMatch) {
			const newLoginAttempts = Number(user.login_attempts) + 1
			let lockUntil = user.lock_until

			if (newLoginAttempts >= maxLoginAttempts) {
				lockUntil = Date.now() + lockPeriodMinutes * 60 * 1000
			}

			await this.userRepository.update(user.id, {
				login_attempts: newLoginAttempts,
				lock_until: lockUntil
			})

			throw new BadRequestException(
				'Email или пароль не верные, попробуйте еще раз!'
			)
		}

		await this.userRepository.update(user.id, {
			login_attempts: 0,
			lock_until: null
		})
		return user
	}

	async checkUserLock(user: User): Promise<void> {
		const currentTime = Date.now()

		if (user.lock_until && user.lock_until > currentTime) {
			const unlockDate = new Date(Number(user.lock_until))
			const unlockTime = unlockDate.toLocaleString('ru-RU', {
				day: 'numeric',
				month: 'long',
				hour: '2-digit',
				minute: '2-digit'
			})
			throw new BadRequestException(
				`Ваш аккаунт временно заблокирован. Разблокировка: ${unlockTime}`
			)
		}

		if (user.lock_until && user.lock_until <= currentTime) {
			await this.userRepository.update(user.id, {
				login_attempts: 0,
				lock_until: null
			})
		}
	}

	async verifyToken(token: string) {
		const decodedToken = await this.jwtService.decode(token)
		if (!decodedToken) {
			return
		}

		return await this.userRepository.findOne({
			where: { id: decodedToken.id }
		})
	}

	// ------------------------------

	async register(req: Request, user: RegisterUserDto) {
		const userExists = await this.userService.findByEmail(user.email)

		if (userExists) {
			throw new ConflictException(
				'Пользователь с таким email уже существует!'
			)
		}

		// Получаем настройки сложности и длины пароля из БД
		// const generalSettings =
		// 	await this.generalSettingsEntityRepository.find()
		// const minPasswordLength = generalSettings[0]?.min_password_length
		// const requiredComplexity = generalSettings[0]
		// 	?.password_complexity as ComplexityPasswordEnum
		//
		// // Проверка сложности пароля
		// this.checkPasswordComplexity(
		// 	user.password,
		// 	requiredComplexity,
		// 	minPasswordLength
		// )

		// Хеширование пароля перед сохранением
		user.password = await argon2.hash(user.password)

		// Создание пользователя с настройками по умолчанию
		const newUser = await this.userRepository.save({
			id: uuidv4(),
			...user,
			role: UserRole.STUDENT,
			isVerified: false,
			method_auth: AuthMethodEnum.CREDENTIALS
		})

		await this.mailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Ваш аккаунт успешно создан! Мы отправили письмо с кодом подтверждения на вашу почту.'
		}
	}

	async login(req: Request, user: LoginDto, res: Response) {
		const userData = await this.userService.findByEmail(user.email)

		if (!userData || !userData.password) {
			throw new NotFoundException('Пользователь не найден!')
		}

		const isValidPassword = await verify(userData.password, user.password)

		if (!isValidPassword) {
			await this.eventEntityRepository.save({
				user: userData,
				description: 'Попытка входа, неверный пароль.',
				action: ActionEvent.LOGIN,
				success: false
			})
			throw new UnauthorizedException(
				'Неверный логин или пароль. Попробуйте еще раз!'
			)
		}

		if (!userData.isVerified) {
			await this.mailConfirmationService.sendVerificationToken(
				userData.email
			)

			await this.eventEntityRepository.save({
				user: userData,
				description: 'Попытка входа, почта неподтверждена.',
				action: ActionEvent.LOGIN,
				success: false
			})
			throw new UnauthorizedException(
				'Ваш email не подтверждён, проверьте почту.'
			)
		}

		if (userData.is_two_factor_enabled) {
			if (!user.code) {
				await this.twoFactorService.sendTwoFactorToken(userData.email)

				return res.status(200).send({
					message: 'Проверьте почту, отправлен двухфакторный код.'
				})
			}

			await this.twoFactorService.validateTwoFactorToken(
				userData.email,
				user.code
			)
		}

		// Устанавливаем куки с флагами безопасности
		res.cookie('userRole', userData.role, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600000
		})

		await this.eventEntityRepository.save({
			user: userData,
			description: 'Попытка входа',
			action: ActionEvent.LOGIN,
			success: true
		})

		// Возвращаем успешный ответ с сессией
		const session = await this.saveSession(req, userData)
		return res.status(200).send(session) // Завершаем ответ
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.accountRepository.findOne({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		let user = account?.id
			? await this.userService.findById(account.id)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethodEnum[profile.provider.toUpperCase()],
			true
		)

		if (!account) {
			await this.accountRepository.save({
				id: user.id,
				userId: user.id,
				user: null,
				type: 'oauth',
				provider: profile.provider,
				access_token: profile.access_token,
				refresh_token: profile.refresh_token,
				expires_at: profile.expires_at
			})
		}

		await this.usersLevelsService.setDefaultLevelToUser(user)

		return this.saveSession(req, user)
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(async err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию!'
						)
					)
				}

				await this.eventEntityRepository.save({
					user: req['user'],
					description: 'Попытка выхода',
					action: ActionEvent.LOGOUT,
					success: true
				})

				res.clearCookie(this.configService.get('SESSION_NAME'))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию'
						)
					)
				}

				resolve({ user })
			})
		})
	}
}
