import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractToken(context);

    console.log('token', token);
    const user = await this.validateToken(token);

    console.log('USER', user);
    if (!user) {
      console.log('user', user);
      throw new BadRequestException('Error!');
    }
    // const isPublic = this.reflector.get<boolean>(
    //   'isPublic',
    //   context.getHandler(),
    // );
    //
    // if (isPublic) {
    //   return true;
    // }

    return true;
  }

  private async validateToken(token: string) {
    return await this.authService.verifyToken(token);
  }

  private extractToken(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return token;
  }
}
