import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
import { RegisterUserDto } from './dto/register.dto'
import { BadRequestResponseDto } from '../types/BadRequestResponseDto'
import { RegisterResponseDto } from './dto/register_response.dto'
import { LoginResponseDto } from './dto/login_response.dto'
import { Request, Response } from 'express'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { AuthProviderGuard } from './guards/provider.guard'
import { ProviderService } from './provider/provider.service'
import { ConfigService } from '@nestjs/config'

@ApiTags('Авторизация')
@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService
	) {}

	@Recaptcha()
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
	@HttpCode(HttpStatus.OK)
	async register(@Body() userDto: RegisterUserDto, @Req() req: Request) {
		return this.authService.register(req, userDto)
	}

	@Recaptcha()
	@Post('login')
	@ApiBody({ type: LoginDto })
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
	async login(@Body() userDto: LoginDto, @Req() req: Request) {
		return await this.authService.login(req, userDto)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}

	@UseGuards(AuthProviderGuard)
	@Get('/auth/oauth/callback/:provider')
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	): Promise<void> {
		console.log('addf')
		if (!code) {
			throw new BadRequestException('Не был предоставлен код авторизации')
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		return res.redirect(
			`${this.configService.getOrThrow<string>('CLIENT_URL')}/platform/profile`
		)
	}

	@UseGuards(AuthProviderGuard)
	@Get('/auth/oauth/connect/:provider')
	@HttpCode(HttpStatus.OK)
	public async connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider)

		return {
			url: providerInstance.getAuthUrl()
		}
	}
}
