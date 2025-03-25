import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { ThreeModelItem } from './item.entity'

@Entity('3d_categories')
export class ThreeModelCategory {
	@PrimaryColumn({ type: 'uuid' })
	id: string

	@Column({ type: 'varchar' })
	name: string

	@OneToMany(() => ThreeModelItem, item => item.category)
	items: ThreeModelItem[]
}
