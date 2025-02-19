import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { UserService } from '../../user/user.service'
import { Socket } from 'socket.io'

@Injectable()
export class WsAuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client: Socket = context.switchToWs().getClient()
		const userId = client.handshake.auth?.userId // Получаем userId из WebSocket handshake

		if (!userId) {
			throw new UnauthorizedException('Пользователь не авторизован')
		}

		const user = await this.userService.findById(userId)
		if (!user) {
			throw new UnauthorizedException('Пользователь не найден')
		}

		client.data.user = user // Сохраняем пользователя в сокете
		return true
	}
}
