import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger'
import { LoginUserDto } from './dto/login.dto'
import { RegisterUserDto } from './dto/register.dto'
import { BadRequestResponseDto } from '../types/BadRequestResponseDto'
import { RegisterResponseDto } from './dto/register_response.dto'
import { LoginResponseDto } from './dto/login_response.dto'
import { Request, Response } from 'express'

@ApiTags('Авторизация')
@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiBody({ type: RegisterUserDto })
	@ApiOperation({ summary: 'Register new user' })
	@ApiBadRequestResponse({
		status: HttpStatus.BAD_REQUEST,
		type: BadRequestResponseDto,
		description: 'Error register'
	})
	@ApiOkResponse({
		status: HttpStatus.OK,
		type: RegisterResponseDto,
		description: 'Register new user'
	})
	async registerUser(@Body() userDto: RegisterUserDto) {
		return this.authService.registerUser(userDto)
	}

	@Post('login')
	@ApiBody({ type: LoginUserDto })
	@ApiOperation({ summary: 'Log in in system' })
	@ApiBadRequestResponse({
		status: HttpStatus.BAD_REQUEST,

		type: BadRequestResponseDto,

		description: 'Error log in in system'
	})
	@ApiOkResponse({
		status: HttpStatus.OK,
		type: LoginResponseDto,
		description: ''
	})
	async login(
		@Body() userDto: LoginUserDto,
		@Req() req,
		@Res() res: Response
	) {
		console.log(req.cookies)
		const response = await this.authService.login(userDto, res)
		return res.status(HttpStatus.OK).json(response)
	}
}
