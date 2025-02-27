import { Module } from '@nestjs/common'
import { PurchasesService } from './purchases.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from './entity/purchases.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Purchase])],
	providers: [PurchasesService]
})
export class PurchasesModule {}
