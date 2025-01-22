import { Module } from '@nestjs/common'
import { EventsService } from './events.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from './entity/event.entity'
import { EventsController } from './events.controller'
import { UserModule } from '../user/user.module'

@Module({
	imports: [TypeOrmModule.forFeature([EventEntity]), UserModule],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService]
})
export class EventsModule {}
