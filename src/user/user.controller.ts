import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Req,
	Res,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create_user.dto'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { Serialize } from '../decorators/serialize.decorator'
import { UsersResponseDto } from './dto/users_response_dto'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { GlobalActionDto } from './dto/global-action.dto'
import { ChangeUserProfileDto } from './dto/change-user-profile.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'src/config/multerConfig'
import { ChangePasswordDto } from './dto/change-password.dto'
import { ChangeUserRoleDto } from './dto/change-user-role.dto'
import { BlockUserDto } from './dto/block-user.dto'
import { Authorized } from '../auth/decorators/authorized.decorator'
import { Authorization } from '../auth/decorators/auth.decorator'
import { Request, Response } from 'express'

@ApiTags('Пользователи')
@Controller()
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Get('users')
	@Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@ApiOperation({ summary: 'Get all users' })
	@Serialize(UsersResponseDto)
	async findAll() {
		return await this.userService.findAll()
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Delete('user/:id')
	@ApiOperation({ summary: 'Delete user' })
	@ResponseMessage('Пользователь успешно удален!')
	async deleteUser(@Param('id') id: string) {
		return await this.userService.delete(id)
	}

	// @Roles(UserRole.SUPER_ADMIN)
	// @Post('user')
	// @ApiOperation({ summary: 'Create new user' })
	// @ApiBody({ type: CreateUserDto })
	// @Serialize(UsersResponseDto)
	// @ResponseMessage('Пользователь успешно создан!')
	// async createUser(@Body() body: CreateUserDto) {
	// 	return await this.userService.create(body)
	// }

	@Get('users/:id')
	@ApiOperation({ summary: 'Get ' })
	// @Serialize(UserDetailsByIdDto)
	async getUserById(@Param('id') id: string) {
		return await this.userService.findById(id)
	}

	@Put('/user/:id')
	@ApiOperation({ summary: 'Change user info' })
	async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
		return await this.userService.update(id, body)
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Get('/search-users')
	@Serialize(UsersResponseDto)
	async searchUser(@Query() query: { query: string }) {
		return this.userService.searchUserByNameOrEmail(query.query)
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Post('/global-action')
	async setGlobalAction(@Body() body: GlobalActionDto) {
		await this.userService.setGlobalAction(body)
	}

	@Authorization()
	@Get('/profile-user')
	async getUserProfileInfo(@Authorized('id') userId: string) {
		return await this.userService.getUserProfileInfo(userId)
	}

	@Authorization(
		UserRole.SUPER_ADMIN,
		UserRole.TEACHER,
		UserRole.MODERATOR,
		UserRole.STUDENT
	)
	@Put('/profile')
	@ResponseMessage('Данные успешно сохранены!')
	async updateProfile(
		@Body() body: ChangeUserProfileDto,
		@Req() req: Request
	) {
		return await this.userService.updateProfile(body, req['user?'])
	}

	@Authorization(
		UserRole.SUPER_ADMIN,
		UserRole.TEACHER,
		UserRole.MODERATOR,
		UserRole.STUDENT
	)
	@Put('/upload-avatar')
	@ResponseMessage('Данные успешно сохранены!')
	@UseInterceptors(FileInterceptor('logo_avatar', multerOptions))
	async uploadAvatar(
		@UploadedFile() image: Express.Multer.File,
		@Req() req: Request
	) {
		let imagePath = null
		if (image) {
			imagePath = 'uploads/' + image.filename
		}

		await this.userService.uploadAvatar(imagePath, req['user?'])

		return imagePath
	}

	@Authorization(
		UserRole.SUPER_ADMIN,
		UserRole.TEACHER,
		UserRole.MODERATOR,
		UserRole.STUDENT
	)
	@Post('change-password')
	@ResponseMessage('Пароль успешно обновлен!')
	async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
		return await this.userService.changePassword(body, req['user?'])
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Put('change-user-role')
	@ResponseMessage('Роль успешно обновлена!')
	async chnageUserRole(@Body() body: ChangeUserRoleDto) {
		await this.userService.changeUserRole(body)
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Put('/block-user')
	async blockUser(@Body() body: BlockUserDto) {
		return await this.userService.blockUser(body)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	async findProfile(@Authorized('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Delete('/delete-account')
	async deleteAccount(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Authorized('id') id: string) {
		return await this.userService.deleteAccount(id, req, res)
	}

	@HttpCode(HttpStatus.OK)
	@Get('/get-teachers')
	async getTeachers() {
		return await this.userService.getAllTeachers()
	}
}
