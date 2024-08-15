import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Serialize } from '../decorators/serialize.decorator';
import { UserDetailsByIdDto } from './dto/user_details_by_id.dto';
import { UsersResponseDto } from './dto/users_response_dto';
import { ResponseMessage } from '../decorators/response-message.decorator';

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all users' })
  @Serialize(UsersResponseDto)
  async findAll() {
    return await this.userService.findAll();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('user')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Query() query: DeleteUserDto) {
    await this.userService.delete(query.id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('user')
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @Serialize(UsersResponseDto)
  @ResponseMessage('Пользователь успешно создан!')
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get ' })
  @Serialize(UserDetailsByIdDto)
  async getUserById(@Param('id') id: number) {
    return await this.userService.findOneById(id);
  }

  @Put('/user/:id')
  @ApiOperation({ summary: 'Change user info' })
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
    return await this.userService.update(id, body);
  }
}
