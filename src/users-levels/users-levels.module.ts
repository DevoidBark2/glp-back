import { forwardRef, Module } from '@nestjs/common'
import { UsersLevelsService } from './users-levels.service'
import { UsersLevelsController } from './users-levels.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserLevel } from './entity/user-level.entity'
import { UserModule } from '../user/user.module'

@Module({
	imports: [
		forwardRef(() => UserModule),
		TypeOrmModule.forFeature([UserLevel])
	],
	controllers: [UsersLevelsController],
	providers: [UsersLevelsService],
	exports: [UsersLevelsService]
})
export class UsersLevelsModule {}
