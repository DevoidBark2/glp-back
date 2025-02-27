import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Icon } from './entity/icons.entity'
import { User } from '../../user/entity/user.entity'
import { Purchase } from '../purchases/entity/purchases.entity'
import { ActiveCustomization } from '../active_customizations/entity/active_customizations.entity'

@Injectable()
export class IconsService {
	constructor(
		@InjectRepository(Icon)
		private readonly iconRepository: Repository<Icon>,
		@InjectRepository(Purchase)
		private readonly purchaseRepository: Repository<Purchase>,
		@InjectRepository(ActiveCustomization)
		private readonly activeCustomizationRepository: Repository<ActiveCustomization>
	) {}

	async findAllForUser(user: User) {
		const icons = await this.iconRepository.find({
			order: {
				id: 'ASC'
			}
		})

		const purchasedIcons = await this.purchaseRepository.find({
			where: {
				user: { id: user.id }
			},
			relations: {
				icon: true
			}
		})

		console.log(purchasedIcons)

		const activeCustomization =
			await this.activeCustomizationRepository.findOne({
				where: { user: { id: user.id } },
				relations: {
					icon: true
				}
			})

		console.log(activeCustomization)

		return icons.map(icon => ({
			...icon,
			isPurchased: purchasedIcons.some(p => p.icon?.id === icon.id), // Используем проверку на null
			isActive: activeCustomization?.icon?.id === icon.id // Опциональная проверка на null
		}))
	}
}
