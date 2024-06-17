import {Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import {LocalAuthGuard} from "./guards/local-auth.guards";

@ApiTags('Авторизация')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  async registerUser(@Body() req: RegisterUserDto){
    return this.authService.registerUser(req)
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({type: LoginUserDto})
  async login(@Request() req: { user: { email:string }}) {
    return this.authService.login(req.user);
  }
}
