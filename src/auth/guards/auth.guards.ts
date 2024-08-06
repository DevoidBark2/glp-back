import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../constants/contants';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuards implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    console.log('here', roles);
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    console.log('TOKEN', token);
    const user = await this.userService.getUserByToken(token);
    if (!user) {
      throw new BadRequestException('User not found!');
    }

    console.log(user);
    if (roles && !roles.includes(user.role)) {
      throw new ForbiddenException('У вас нет прав!');
    }
    return true;
  }
}
