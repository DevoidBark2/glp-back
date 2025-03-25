import { Module } from '@nestjs/common'
import { CoinsService } from './coins.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entity/user.entity'
import { UserLevel } from 'src/users-levels/entity/user-level.entity'

@Module({
	imports: [TypeOrmModule.forFeature([User, UserLevel])],
	providers: [CoinsService],
	exports: [CoinsService]
})
export class CoinsModule {}
