import { Module } from '@nestjs/common'
import { EffectsService } from './effects.service'
import { EffectsController } from './effects.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Effect } from './entity/effects.entity'
import { UserModule } from 'src/user/user.module'
import { Purchase } from '../purchases/entity/purchases.entity'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Effect, Purchase, ActiveCustomization]),
		UserModule
	],
	controllers: [EffectsController],
	providers: [EffectsService]
})
export class EffectsModule {}
