import { Module } from '@nestjs/common'
import { CustomizeService } from './customize.service'
import { CustomizeController } from './customize.controller'
import { User } from '../user/entity/user.entity'
import { Purchase } from './purchases/entity/purchases.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Frame } from './frames/entity/frames.entity'
import { Icon } from './icons/entity/icons.entity'
import { Effect } from './effects/entity/effects.entity'
import { UserModule } from '../user/user.module'
import { ActiveCustomization } from './active_customizations/entity/active_customizations.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			Purchase,
			Frame,
			Icon,
			Effect,
			ActiveCustomization
		]),
		UserModule
	],
	controllers: [CustomizeController],
	providers: [CustomizeService]
})
export class CustomizeModule {}
