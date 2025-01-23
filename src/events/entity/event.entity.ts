import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { ActionEvent } from '../enum/action-event.enum'

@Entity('events')
export class EventEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User

	@Column({ type: 'enum', enum: ActionEvent })
	action: string

	@Column()
	description: string

	@Column()
	success: boolean

	@CreateDateColumn()
	created_at: Date
}
