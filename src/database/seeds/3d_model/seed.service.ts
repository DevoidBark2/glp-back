import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ThreeModelCategory } from 'src/three-model/entity/category.entity'
import { ThreeModelItem } from 'src/three-model/entity/item.entity'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class SeedService {
	constructor(
		@InjectRepository(ThreeModelCategory)
		private categoryRepository: Repository<ThreeModelCategory>,

		@InjectRepository(ThreeModelItem)
		private itemRepository: Repository<ThreeModelItem>
	) {}

	async seed() {
		await this.itemRepository.delete({})
		await this.categoryRepository.delete({})

		// Создание категорий
		const categories = [
			{ id: uuidv4(), name: 'Волосы' },
			{ id: uuidv4(), name: 'Глаза' },
			{ id: uuidv4(), name: 'Одежда' },
			{ id: uuidv4(), name: 'Аксессуары' }
		]
		await this.categoryRepository.save(categories)
		console.log('✅ Категории загружены')

		// Получаем сохраненные категории
		const savedCategories = await this.categoryRepository.find()

		// Создание предметов
		const items = [
			{
				id: uuidv4(),
				name: 'Красные волосы',
				modelPath: '/models/hair_red.glb',
				texturePath: '/textures/hair_red.png',
				price: 100,
				category: savedCategories.find(cat => cat.name === 'Волосы')
			},
			{
				id: uuidv4(),
				name: 'Синие глаза',
				modelPath: '/models/eyes_blue.glb',
				texturePath: '/textures/eyes_blue.png',
				price: 50,
				category: savedCategories.find(cat => cat.name === 'Глаза')
			},
			{
				id: uuidv4(),
				name: 'Футболка черная',
				modelPath: '/models/shirt_black.glb',
				texturePath: '/textures/shirt_black.png',
				price: 200,
				category: savedCategories.find(cat => cat.name === 'Одежда')
			},
			{
				id: uuidv4(),
				name: 'Очки в стиле киберпанк',
				modelPath: '/models/cyberpunk_glasses.glb',
				texturePath: '/textures/cyberpunk_glasses.png',
				price: 300,
				category: savedCategories.find(cat => cat.name === 'Аксессуары')
			}
		]
		await this.itemRepository.save(items)
		console.log('✅ Предметы загружены')

		console.log('🌱 Seed завершён!')
	}
}
