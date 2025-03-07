import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Frame } from './entity/frames.entity'
import { Purchase } from '../purchases/entity/purchases.entity'
import { User } from '../../user/entity/user.entity'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'

@Injectable()
export class FramesService {
	constructor(
		@InjectRepository(Frame)
		private readonly frameRepository: Repository<Frame>,

		@InjectRepository(Purchase)
		private readonly purchaseRepository: Repository<Purchase>,

		@InjectRepository(ActiveCustomization)
		private readonly activeCustomizationRepository: Repository<ActiveCustomization>
	) { }

	async findAllForUser(user: User) {
		const frames = await this.frameRepository.find({
			order: {
				id: 'ASC'
			}
		})

		const purchasedFrames = await this.purchaseRepository.find({
			where: {
				user: { id: user.id }
			},
			relations: {
				frame: true
			}
		})

		// Получаем активную рамку
		const activeCustomization =
			await this.activeCustomizationRepository.findOne({
				where: { user: { id: user.id } },
				relations: {
					frame: true
				}
			})

		return frames.map(frame => ({
			...frame,
			isPurchased: purchasedFrames.some(p => p.frame?.id === frame.id), // Используем проверку на null
			isActive: activeCustomization?.frame.id === frame.id // Опциональная проверка на null
		}))
	}
}
