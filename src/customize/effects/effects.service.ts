import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Effect } from './entity/effects.entity'
import { Repository } from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { Frame } from '../frames/entity/frames.entity'
import { Purchase } from '../purchases/entity/purchases.entity'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'

@Injectable()
export class EffectsService {
	constructor(
		@InjectRepository(Effect)
		private readonly effectRepository: Repository<Effect>,
		@InjectRepository(Purchase)
		private readonly purchaseRepository: Repository<Purchase>,
		@InjectRepository(ActiveCustomization)
		private readonly activeCustomizationRepository: Repository<ActiveCustomization>
	) {}

	async findAllForUser(user: User) {
		const effects = await this.effectRepository.find({
			order: {
				id: 'ASC'
			}
		})

		const purchasedEffects = await this.purchaseRepository.find({
			where: {
				user: { id: user.id }
			},
			relations: {
				effect: true
			}
		})

		const activeCustomization =
			await this.activeCustomizationRepository.findOne({
				where: { user: { id: user.id } },
				relations: {
					effect: true
				}
			})

		return effects.map(effect => ({
			...effect,
			isPurchased: purchasedEffects.some(p => p.effect?.id === effect.id),
			isActive: activeCustomization?.effect?.id === effect.id
		}))
	}
}
