import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@ApiTags('Авторизация')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  async registeruser(@Body() req: RegisterUserDto){

  }

  @Post('login')
  @ApiBody({type: LoginUserDto})
  async loginUser(@Body() req: LoginUserDto){
    
  }
}
