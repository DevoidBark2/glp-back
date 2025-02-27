import { Module } from '@nestjs/common'
import { FramesService } from './frames.service'
import { FramesController } from './frames.controller'
import { Frame } from './entity/frames.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'
import { Purchase } from '../purchases/entity/purchases.entity'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Frame, Purchase, ActiveCustomization]),
		UserModule
	],
	controllers: [FramesController],
	providers: [FramesService]
})
export class FramesModule {}
