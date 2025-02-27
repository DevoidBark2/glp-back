import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Purchase } from './purchases/entity/purchases.entity'
import { User } from '../user/entity/user.entity'
import { Frame } from './frames/entity/frames.entity'
import { Icon } from './icons/entity/icons.entity'
import { Effect } from './effects/entity/effects.entity'
import { BuyItemDto } from './dto/buy-item.dto'
import { ActiveCustomization } from './active_customizations/entity/active_customizations.entity'

@Injectable()
export class CustomizeService {
	constructor(
		@InjectRepository(Purchase)
		private readonly purchaseRepository: Repository<Purchase>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Frame)
		private readonly frameRepository: Repository<Frame>,
		@InjectRepository(Icon)
		private readonly iconRepository: Repository<Icon>,
		@InjectRepository(Effect)
		private readonly effectRepository: Repository<Effect>,
		@InjectRepository(ActiveCustomization)
		private readonly activeCustomizationRepository: Repository<ActiveCustomization>
	) {}

	// Покупка кастомизации
	async buyItem(currentUser: User, body: BuyItemDto) {
		// Получаем пользователя
		const user = await this.userRepository.findOne({
			where: { id: currentUser.id }
		})
		if (!user) throw new BadRequestException('Пользователь не найден')

		let item
		if (body.category === 'frames')
			item = await this.frameRepository.findOne({
				where: { id: body.item.id }
			})
		if (body.category === 'icons')
			item = await this.iconRepository.findOne({
				where: { id: body.item.id }
			})
		if (body.category === 'effects')
			item = await this.effectRepository.findOne({
				where: { id: body.item.id }
			})

		if (!item) throw new BadRequestException('Товар не найден')

		// Проверяем, куплен ли уже этот предмет
		const existingPurchase = await this.purchaseRepository.findOne({
			where: {
				user: { id: currentUser.id },
				[`${body.category.slice(0, -1)}`]: { id: body.item.id }
			}
		})
		if (existingPurchase)
			throw new BadRequestException('Этот предмет уже куплен')

		// Проверяем, хватает ли денег
		if (user.coins < item.price)
			throw new BadRequestException('Недостаточно средств')

		// Вычитаем деньги у пользователя
		await this.userRepository.update(currentUser.id, {
			coins: user.coins - item.price
		})

		// Записываем покупку
		const purchase = this.purchaseRepository.create({
			user,
			[body.category.slice(0, -1)]: item
		})
		await this.purchaseRepository.save(purchase)

		return {
			message: 'Покупка успешна',
			balance: user.coins - item.price
		}
	}

	async selectedCustomizeItem(user: User, body: BuyItemDto) {
		const { category, item } = body

		let purchase

		switch (category) {
			case 'frames':
				purchase = await this.frameRepository.findOne({
					where: { id: item.id }
				})
				break
			case 'icons':
				purchase = await this.iconRepository.findOne({
					where: { id: item.id }
				})
				break
			case 'effects':
				purchase = await this.purchaseRepository.findOne({
					where: { id: item.id }
				})
				break
			default:
				throw new Error('Неверная категория')
		}

		// Если покупка не найдена, выбрасываем ошибку
		if (!purchase) {
			throw new Error(`${category.slice(0, -1)} не куплена`) // Например, "Рамка не куплена"
		}

		const activeCustomizationData: Partial<ActiveCustomization> = {
			user: user
		}

		// В зависимости от категории сохраняем соответствующий элемент
		switch (category) {
			case 'frames':
				activeCustomizationData.frame = purchase // Здесь у вас будет объект рамки
				break
			case 'icons':
				activeCustomizationData.icon = purchase // Здесь у вас будет объект иконки
				break
			case 'effects':
				activeCustomizationData.effect = purchase // Здесь у вас будет объект эффекта
				break
		}

		await this.activeCustomizationRepository.save(activeCustomizationData)

		return { message: `${category.slice(0, -1)} применена` } // Например, "Рамка применена"
	}
}
