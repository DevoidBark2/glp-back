import { Module } from '@nestjs/common'
import { FaqService } from './faq.service'
import { FaqController } from './faq.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FaqEntity } from './entity/faq.entity'

@Module({
	imports: [TypeOrmModule.forFeature([FaqEntity])],
	controllers: [FaqController],
	providers: [FaqService]
})
export class FaqModule {}
