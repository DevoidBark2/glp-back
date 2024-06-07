import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create_user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-user')
  @ApiBody({type: CreateUserDto})
  async createUser(@Body() body: CreateUserDto){
    return "sadasd"
  }
}
