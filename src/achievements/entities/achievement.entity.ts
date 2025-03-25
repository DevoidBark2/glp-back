import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ConditionTypeEnum } from '../enums/condition_type.enum'

@Entity('achievements')
export class Achievement {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 255 })
	title: string
	@Column({ type: 'varchar', length: 255 })
	description: string
	@Column({ type: 'varchar', length: 255 })
	icon: string
	@Column({ type: 'enum', enum: ConditionTypeEnum })
	condition: ConditionTypeEnum
	@Column({ type: 'numeric' })
	targetValue: number
}
