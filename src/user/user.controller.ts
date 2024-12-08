import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
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
import { GlobalActionDto } from './dto/global-action.dto';
import { ChangeUserProfileDto } from './dto/change-user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multerConfig';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';

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
  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ResponseMessage('Пользователь успешно удален!')
  async deleteUser(@Param('id') id: number) {
    return await this.userService.delete(id);
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
  // @Serialize(UserDetailsByIdDto)
  async getUserById(@Param('id') id: number) {
    return await this.userService.findOneById(id);
  }

  @Put('/user/:id')
  @ApiOperation({ summary: 'Change user info' })
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
    return await this.userService.update(id, body);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Get('/search-users')
  @Serialize(UsersResponseDto)
  async searchUser(@Query() query: { query: string }) {
    return this.userService.searchUserByNameOrEmail(query.query);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('/global-action')
  async setGlobalAction(@Body() body: GlobalActionDto) {
    await this.userService.setGlobalAction(body);
  }

  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.TEACHER,
    UserRole.MODERATOR,
    UserRole.STUDENT,
  )
  @Get('/profile-user')
  async getUserProfileInfo(@Req() req: Request) {
    return await this.userService.getUserProfileInfo(req['user']);
  }

  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.TEACHER,
    UserRole.MODERATOR,
    UserRole.STUDENT,
  )
  @Put('/profile')
  @ResponseMessage('Данные успешно сохранены!')
  async updateProfile(@Body() body: ChangeUserProfileDto, @Req() req: Request) {
    return await this.userService.updateProfile(body, req['user']);
  }

  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.TEACHER,
    UserRole.MODERATOR,
    UserRole.STUDENT,
  )
  @Put('/upload-avatar')
  @ResponseMessage('Данные успешно сохранены!')
  @UseInterceptors(FileInterceptor('logo_avatar', multerOptions))
  async uploadAvatar(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
  ) {
    let imagePath = null;
    if (image) {
      imagePath = 'uploads/' + image.filename;
    }

    await this.userService.uploadAvatar(imagePath, req['user']);

    return imagePath;
  }

  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.TEACHER,
    UserRole.MODERATOR,
    UserRole.STUDENT,
  )
  @Post('change-password')
  @ResponseMessage('Пароль успешно обновлен!')
  async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    return await this.userService.changePassword(body, req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put('change-user-role')
  @ResponseMessage('Роль успешно обновлена!')
  async chnageUserRole(@Body() body: ChangeUserRoleDto) {
    await this.userService.changeUserRole(body);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put('/block-user')
  async blockUser(@Body() body: BlockUserDto) {
    return await this.userService.blockUser(body);
  }
}
