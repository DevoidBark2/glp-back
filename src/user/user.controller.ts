import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { DeleteUserDto } from './dto/delete-user.dto';

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.SUPER_ADMIN)
  @Post('user')
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() body: CreateUserDto) {
    try {
      return await this.userService.createUser(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('user')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Query() query: DeleteUserDto) {
    try {
      await this.userService.delete(query.id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  // для профиля ?
  @Get('get-user')
  @ApiOperation({ summary: 'Get info user by ID' })
  @ApiQuery({ name: 'token', description: 'Authorization token' })
  async getUserData(@Req() req: Request) {
    const token = req.headers['authorization'];
    return await this.userService.getUserData(token);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all users' })
  @Get('users')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get ' })
  async getUserById(@Param('id') id: number) {
    try {
      return await this.userService.findOneById(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Put('/user')
  @ApiOperation({ summary: 'Change user info' })
  async updateUser() {
    try {
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
