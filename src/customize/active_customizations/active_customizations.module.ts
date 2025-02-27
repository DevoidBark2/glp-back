import { Module } from '@nestjs/common'
import { ActiveCustomizationsService } from './active_customizations.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActiveCustomization } from './entity/active_customizations.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ActiveCustomization])],
	providers: [ActiveCustomizationsService]
})
export class ActiveCustomizationsModule {}
