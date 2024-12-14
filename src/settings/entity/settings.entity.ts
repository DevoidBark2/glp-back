import {
	Column,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	JoinColumn
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { TYPES_VERTEX } from '../enum/type_vertex.enum'

@Entity('settings')
export class SettingsEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'text' })
	vertex_color: string
	@Column({ type: 'text' })
	edge_color: string
	@Column({ type: 'enum', enum: TYPES_VERTEX })
	type_vertex: string
	@Column({ type: 'text' })
	border_vertex: string
	@Column({ type: 'boolean' })
	enabled_grid: boolean
	@Column({ type: 'text', nullable: true })
	background_color: string
	@OneToOne(() => User, user => user.settings, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User
}
