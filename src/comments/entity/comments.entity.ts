import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn
} from 'typeorm'
import { SectionEntity } from '../../section/entity/section.entity'
import { User } from '../../user/entity/user.entity'

@Entity('comments')
export class Comments {
	@PrimaryColumn({ type: 'uuid' })
	id: string
	@Column({ type: 'varchar' })
	text: string
	@ManyToOne(() => SectionEntity, section => section.id, {
		onDelete: 'CASCADE'
	})
	section: SectionEntity
	@ManyToOne(() => User, user => user.id, {
		onDelete: 'CASCADE'
	})
	user: User
	@CreateDateColumn()
	createdAt: Date
}
