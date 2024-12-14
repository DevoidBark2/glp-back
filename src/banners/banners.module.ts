import { Module } from '@nestjs/common'
import { BannersService } from './banners.service'
import { BannersController } from './banners.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BannerEntity } from './entity/banner.entity'

@Module({
	imports: [TypeOrmModule.forFeature([BannerEntity])],
	controllers: [BannersController],
	providers: [BannersService]
})
export class BannersModule {}
