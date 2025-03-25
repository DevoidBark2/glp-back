import { UserRole } from '../../constants/contants'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { Roles } from '../../decorators/roles.decorator'
import { AuthGuards } from '../guards/auth.guards'
import { RolesGuard } from '../guards/roles.guard'

export function Authorization(...roles: UserRole[]) {
	if (roles.length > 0) {
		return applyDecorators(
			Roles(...roles),
			UseGuards(AuthGuards, RolesGuard)
		)
	}

	return applyDecorators(UseGuards(AuthGuards))
}
