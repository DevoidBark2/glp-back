import { Module } from '@nestjs/common'
import { IconsService } from './icons.service'
import { IconsController } from './icons.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Icon } from './entity/icons.entity'
import { UserModule } from 'src/user/user.module'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'
import { Purchase } from '../purchases/entity/purchases.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Icon, ActiveCustomization, Purchase]),
		UserModule
	],
	controllers: [IconsController],
	providers: [IconsService]
})
export class IconsModule {}
