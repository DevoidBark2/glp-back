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
import { SettingsEntity } from '../settings/entity/settings.entity'
import { LoginDto } from './dto/login.dto'
import { DEFAULT_SETTINGS_FOR_NEW_USER, UserRole } from '../constants/contants'
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

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly generalSettingsService: GeneralSettingsService,
		private readonly configService: ConfigService,
		private readonly mailConfirmationService: MailConfirmationService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(SettingsEntity)
		private readonly settingsEntityRepository: Repository<SettingsEntity>,
		@InjectRepository(GeneralSettingsEntity)
		private readonly generalSettingsEntityRepository: Repository<GeneralSettingsEntity>,
		private readonly jwtService: JwtService,
		private readonly providerService: ProviderService,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>
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
		//
		const settingForNewUser = this.settingsEntityRepository.create({
			vertex_color: DEFAULT_SETTINGS_FOR_NEW_USER.VERTEX_COLOR,
			edge_color: DEFAULT_SETTINGS_FOR_NEW_USER.EDGE_COLOR,
			type_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.TYPE_VERTEX,
			border_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.BORDER_VERTEX,
			enabled_grid: DEFAULT_SETTINGS_FOR_NEW_USER.ENABLED_GRID,
			background_color: DEFAULT_SETTINGS_FOR_NEW_USER.BACKGROUND_COLOR,
			user: newUser
		})

		await this.settingsEntityRepository.save(settingForNewUser)

		await this.mailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Ваш аккаунт успешно создан! Мы отправили письмо с кодом подтверждения на вашу почту.'
		}
	}

	async login(req: Request, user: LoginDto) {
		const userData = await this.userService.findByEmail(user.email)

		if (!userData || !userData.password) {
			throw new NotFoundException('Пользователь не найден!')
		}

		const isValidPassword = await verify(userData.password, user.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Неверный пароль. Попробуйте другой пароль!'
			)
		}

		if (!userData.isVerified) {
			await this.mailConfirmationService.sendVerificationToken(
				userData.email
			)
			throw new UnauthorizedException(
				'Ваш email not confirmed, chek yout email'
			)
		}

		// await this.validateUser(user.email, user.password)
		//
		// const token = this.jwtService.sign({
		// 	id: userData.id,
		// 	email: user.email,
		// 	role: userData.role
		// })
		//
		// // Устанавливаем куки с флагами безопасности
		// res.cookie('token', token, {
		// 	httpOnly: true, // Запрещает доступ к куки через JS
		// 	secure: process.env.NODE_ENV === 'production', // Использовать Secure только в production
		// 	maxAge: 3600000
		// })

		return await this.saveSession(req, userData)
		// return {
		// 	id: userData.id,
		// 	email: userData.email,
		// 	role: userData.role,
		// 	token: token,
		// 	user_name: `${userData.second_name} ${userData.first_name} ${userData.last_name}`,
		// 	userAvatar: userData.profile_url,
		// 	pagination_size: userData.pagination_size,
		// 	table_size: userData.table_size,
		// 	show_footer_table: userData.show_footer_table,
		// 	footerContent: userData.footerContent
		// }
	}

	public async extractProfileFromCode(
		req: Request,
		provider: string,
		code: string
	) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		console.log(profile)

		const account = await this.accountRepository.findOne({
			where: {
				id: profile.id,
				provider: profile.provider
			}
		})

		console.log(account)

		let user = account?.userId
			? await this.userService.findById(account.userId)
			: null

		console.log('sds', user)
		if (user) {
			return this.saveSession(req, user)
		}

		console.log('sadsadsadsadsadsad', profile)
		user = await this.userService.create(
			profile.email,
			'',
			profile.name,
			profile.picture,
			AuthMethodEnum[profile.provider.toUpperCase()],
			true
		)

		console.log(user)

		if (!account) {
			console.log('HERERERE')
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

		return this.saveSession(req, user)
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию!'
						)
					)
				}

				res.clearCookie(this.configService.getOrThrow('SESSION_NAME'))
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			console.log('HERE', user)
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
