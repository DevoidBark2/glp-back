import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { DeleteCategoryDto } from '../category/dto/delete-category.dto';
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
}
