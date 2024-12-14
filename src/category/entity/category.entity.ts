import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('categories')
export class CategoryEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 255 })
	name: string
}
