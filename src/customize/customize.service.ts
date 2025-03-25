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

		if (!purchase) {
			throw new Error(`${category.slice(0, -1)} не куплена`) // Например, "Рамка не куплена"
		}

		// Проверяем, есть ли уже активная кастомизация у пользователя
		let activeCustomization =
			await this.activeCustomizationRepository.findOne({
				where: { user: { id: user.id } },
				relations: ['frame', 'icon', 'effect'] // Подгружаем текущие активные элементы
			})

		if (!activeCustomization) {
			// Если у пользователя нет активной кастомизации, создаём новую запись
			activeCustomization = this.activeCustomizationRepository.create({
				user
			})
		}

		// Обновляем только выбранную категорию
		switch (category) {
			case 'frames':
				activeCustomization.frame = purchase // Устанавливаем новую рамку
				break
			case 'icons':
				activeCustomization.icon = purchase // Устанавливаем новую иконку
				break
			case 'effects':
				activeCustomization.effect = purchase // Устанавливаем новый эффект
				break
		}

		// Сохраняем изменения
		const updatedData =
			await this.activeCustomizationRepository.save(activeCustomization)

		return {
			id: updatedData.id,
			frame: updatedData.frame,
			effect: updatedData.effect,
			icons: updatedData.icon
		}
	}
}
