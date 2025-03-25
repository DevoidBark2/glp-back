import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { ThreeModelCategory } from './category.entity'

@Entity('3d_items')
export class ThreeModelItem {
	@PrimaryColumn({ type: 'uuid' })
	id: string
	@Column()
	name: string // Название предмета (Красные волосы, Очки в стиле киберпанк)

	@Column()
	modelPath: string // Путь к 3D-модели предмета

	@Column()
	texturePath: string // Путь к текстуре

	@Column()
	price: number // Стоимость предмета

	// @ManyToOne(() => BodyPart, (bodyPart) => bodyPart.items)
	// bodyPart: BodyPart;

	@ManyToOne(() => ThreeModelCategory, category => category.items)
	category: ThreeModelCategory
}
