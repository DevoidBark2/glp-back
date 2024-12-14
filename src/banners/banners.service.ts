import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BannerEntity } from './entity/banner.entity'
import { CreateBannerDto } from './dto/create-banner.dto'

@Injectable()
export class BannersService {
	constructor(
		@InjectRepository(BannerEntity)
		private readonly bannerEntityRepository: Repository<BannerEntity>
	) {}

	async findAll() {
		return await this.bannerEntityRepository.find()
	}

	async create(createdBanner: CreateBannerDto) {
		return await this.bannerEntityRepository.save(createdBanner)
	}

	async delete(id: number) {
		const existsBanner = await this.bannerEntityRepository.findOne({
			where: { id: id }
		})

		if (!existsBanner) {
			throw `Банера с ID ${id} не существует!`
		}

		await this.bannerEntityRepository.delete(id)
	}

	async change() {}
}
