import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
	ForbiddenException,
	UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../../constants/contants'
import { ROLES_KEY } from '../../decorators/roles.decorator'
import { UserService } from '../../user/user.service'

@Injectable()
export class AuthGuards implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<UserRole[]>(
			ROLES_KEY,
			context.getHandler()
		)

		if (!roles) {
			return true
		}
		const request: Request = context.switchToHttp().getRequest()
		const token = request.headers['authorization']
		if (!token) {
			throw new UnauthorizedException('Token is missing!')
		}
		const user = await this.userService.getUserByToken(token)
		if (!user) {
			throw new BadRequestException('User not found!')
		}

		if (roles && !roles.includes(user.role)) {
			throw new ForbiddenException('У вас нет прав!')
		}

		request['user'] = user
		return true
	}
}
