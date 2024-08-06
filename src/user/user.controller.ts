import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() body: CreateUserDto) {
    return body;
  }

  @Get('getUserData')
  @ApiQuery({ name: 'token', description: 'Authorization token' })
  async getUserData(@Req() req: Request) {
    const token = req.headers['authorization'];
    return await this.userService.getUserData(token);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('all-users')
  async findAll() {
    return await this.userService.findAll();
  }
}
