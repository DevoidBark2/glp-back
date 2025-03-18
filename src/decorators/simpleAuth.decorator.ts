import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Injectable()
export class SimpleAuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.userId === 'undefined') {
			request.user = null
		}

		request.user = await this.userService.findById(request.session.userId)

		return true
	}
}
