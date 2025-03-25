import { Module } from '@nestjs/common'
import { ThreeModelService } from './three-model.service'
import { ThreeModelController } from './three-model.controller'

@Module({
	controllers: [ThreeModelController],
	providers: [ThreeModelService]
})
export class ThreeModelModule {}
