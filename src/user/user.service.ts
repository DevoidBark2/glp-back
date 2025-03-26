import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { Brackets, Not, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from './dto/create_user.dto'
import { hash, verify } from 'argon2'
import { UserRole } from '../constants/contants'
import { GlobalActionDto } from './dto/global-action.dto'
import { ChangeUserProfileDto } from './dto/change-user-profile.dto'
import { CourseUser } from 'src/course/entity/course-user.entity'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeUserRoleDto } from './dto/change-user-role.dto'
import { BlockUserDto } from './dto/block-user.dto'
import { StatusUserEnum } from './enum/user-status.enum'
import { AuthMethodEnum } from '../auth/enum/auth-method.enum'
import { v4 as uuidv4 } from 'uuid'
import { AuthService } from 'src/auth/auth.service'
import { Request, Response } from 'express'
import { StatusCourseEnum } from '../course/enum/status_course.enum'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(CourseUser)
		private readonly courseUserRepository: Repository<CourseUser>,
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	async findAll() {
		return await this.userRepository.find({
			where: { role: Not(UserRole.SUPER_ADMIN) },
			order: { created_at: 'DESC' }
		})
	}

	async findByEmail(email: string) {
		return this.userRepository.findOne({
			where: { email: email },
			relations: {
				courses: true,
				posts: true,
				accounts: true
			}
		})
	}

	async findById(id: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: id
			},
			relations: {
				courses: {
					category: true
				},
				posts: true
			},
			select: {
				id: true,
				first_name: true,
				second_name: true,
				last_name: true,
				email: true,
				phone: true,
				role: true,
				status: true,
				created_at: true,
				method_auth: true,
				profile_url: true,
				password: false,
				posts: {
					id: true,
					name: true,
					image: true,
					description: true,
					created_at: true
				},
				courses: {
					id: true,
					name: true,
					image: true,
					small_description: true,
					duration: true,
					created_at: true
				}
			}
		})

		if (!user) {
			throw new NotFoundException(`Пользователя с ID ${id} не найден!`)
		}

		return user
	}

	async getPlatformUserById(id: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: id
			},
			relations: {
				courses: {
					category: true
				},
				activeCustomization: {
					frame: true,
					effect: true,
					icon: true
				}
			},
			select: {
				id: true,
				first_name: true,
				second_name: true,
				method_auth: true,
				profile_url: true,
				about_me: true,
				created_at: true,
				last_name: true,
				courses: {
					id: true,
					name: true,
					status: true,
					image: true
				}
			}
		})

		if (!user) {
			throw new NotFoundException(`Пользователя с ID ${id} не найден!`)
		}

		user.courses = user.courses.filter(
			course => course.status === StatusCourseEnum.ACTIVE
		)

		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethodEnum,
		isVerified: boolean
	) {
		return this.userRepository.save({
			id: uuidv4(),
			email: email,
			password: password ? await hash(password) : '',
			first_name: displayName,
			profile_url: picture,
			method_auth: method,
			role: UserRole.STUDENT,
			isVerified: isVerified
		})
	}

	// ---------------------------------
	async getUserByToken(token: string) {
		const decodedToken = await this.jwtService.decode(token.split(' ')[1])

		if (!decodedToken) {
			throw new UnauthorizedException('Invalid Token!')
		}
		return await this.userRepository.findOne({
			where: {
				id: decodedToken.id
			}
		})
	}

	async delete(id: string) {
		const deletedUser = await this.userRepository.findOne({ where: { id } })

		if (!deletedUser) {
			throw `Пользователя с ID ${id} не существует!`
		}
		// await this.accountRepository.delete({
		// 	id: deletedUser.id
		// })
		await this.userRepository.delete(id)
	}

	async update(id: number, updatedUser: CreateUserDto) {
		return await this.userRepository.update(id, updatedUser)
	}

	async searchUserByNameOrEmail(query: string) {
		const queryParts = query.split(' ').filter(Boolean) // Разбиваем строку на части по пробелам и удаляем пустые строки

		return await this.userRepository
			.createQueryBuilder('user')
			.where(
				new Brackets(qb => {
					queryParts.forEach(part => {
						qb.andWhere(
							new Brackets(subQb => {
								subQb
									.where('user.email ILIKE :part', {
										part: `%${part}%`
									})
									.orWhere('user.first_name ILIKE :part', {
										part: `%${part}%`
									})
									.orWhere('user.second_name ILIKE :part', {
										part: `%${part}%`
									})
									.orWhere('user.last_name ILIKE :part', {
										part: `%${part}%`
									})
							})
						)
					})
				})
			)
			.andWhere('user.role != :role', { role: UserRole.SUPER_ADMIN })
			.getMany()
	}

	async setGlobalAction(body: GlobalActionDto) {
		await this.userRepository.update(body.usersIds, { status: body.action })
	}

	async getUserProfileInfo(userId: string) {
		const user = await this.userRepository.findOne({
			where: {
				id: userId
			},
			relations: {
				userLevel: true,
				purchases: true,
				activeCustomization: true
			}
		})

		const userCourses = await this.courseUserRepository.find({
			where: {
				user: { id: userId }
			},
			relations: {
				course: true
			}
		})

		return {
			id: userId,
			first_name: user.first_name,
			second_name: user.second_name,
			last_name: user.last_name,
			image: user.profile_url,
			email: user.email,
			phone: user.phone,
			city: user.city,
			role: user.role,
			birth_day: user.birth_day,
			about_me: user.about_me,
			pagination_size: user.pagination_size,
			table_size: user.table_size,
			show_footer_table: user.show_footer_table,
			footerContent: user.footerContent,
			is_two_factor_enabled: user.is_two_factor_enabled,
			method_auth: user.method_auth,
			created_at: user.created_at,
			userLevel: user.userLevel,
			coins: user.coins,
			purchases: user.purchases,
			activeCustomization: user.activeCustomization,
			exams: user.exams,
			userCourses: userCourses.map(courseUser => {
				return {
					id: courseUser.course.id,
					enrolledAt: courseUser.enrolledAt,
					progress: courseUser.progress,
					name: courseUser.course.name,
					image: courseUser.course.image,
					has_certificate: courseUser.has_certificate,
					small_description: courseUser.course.small_description
				}
			})
		}
	}

	async updateProfile(body: ChangeUserProfileDto, user: User) {
		const currentUser = await this.userRepository.findOne({
			where: { id: user.id }
		})

		if (!currentUser) {
			throw new BadRequestException(
				`Пользователь с ID ${user.id} не найден!`
			)
		}

		await this.userRepository.update(user.id, body)
	}

	async uploadAvatar(image: string, user: User) {
		const currentUser = await this.userRepository.findOne({
			where: { id: user.id }
		})

		if (!currentUser) {
			throw new BadRequestException(
				`Пользователь с ID ${user.id} не найден!`
			)
		}

		await this.userRepository.update(user.id, { profile_url: image })
	}

	async changePassword(body: ChangePasswordDto, user: User) {
		const currentUser = await this.userRepository.findOne({
			where: {
				id: user.id
			}
		})

		const passwordIsMatch = await verify(
			currentUser.password,
			body.currentPassword
		)

		if (!passwordIsMatch) {
			throw new BadRequestException(
				'Текущий пароль не верный,попробуйте еще раз!'
			)
		}

		if (body.currentPassword === body.newPassword) {
			throw new BadRequestException(
				'Новый пароль совпадает с текущим паролем, используйте другой!'
			)
		}

		await this.userRepository.update(currentUser.id, {
			password: await hash(body.newPassword)
		})
	}

	async changeUserRole(body: ChangeUserRoleDto) {
		const user = await this.userRepository.findOne({
			where: {
				id: body.userId
			}
		})

		if (!user) {
			throw new BadRequestException(
				`Пользователь с ID ${body.userId} не найден`
			)
		}

		await this.userRepository.update(body.userId, { role: body.role })
	}

	async blockUser(body: BlockUserDto) {
		const user = await this.userRepository.findOne({
			where: {
				id: body.userId
			}
		})

		if (!user) {
			throw new BadRequestException(
				`Пользователь с ID ${body.userId} не найден`
			)
		}

		await this.userRepository.update(body.userId, { status: body.status })

		return {
			message:
				body.status === StatusUserEnum.ACTIVATED
					? 'Пользователь успешно разблокирован!'
					: 'Пользователь успешно заблокирован!'
		}
	}

	async deleteAccount(id: string, req: Request, res: Response) {
		const user = await this.userRepository.findOneBy({ id })

		if (!user) {
			throw new BadRequestException(
				`Пользователя с ID ${id} не существует!`
			)
		}
		await this.authService.logout(req, res).then(async () => {
			await this.userRepository.delete(id)
		})
	}

	async getAllTeachers() {
		return this.userRepository.find({
			where: {
				role: UserRole.TEACHER
			},
			select: {
				id: true,
				first_name: true,
				second_name: true,
				last_name: true,
				profile_url: true,
				method_auth: true,
				about_me: true
			}
		})
	}
}
