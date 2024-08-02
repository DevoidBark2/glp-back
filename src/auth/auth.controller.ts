import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@ApiTags('Авторизация')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  async registerUser(@Body() req: RegisterUserDto) {
    return this.authService.registerUser(req);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'Log in in system' })
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
