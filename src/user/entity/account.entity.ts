import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity('account')
export class Account {
	@PrimaryColumn({ type: 'varchar' })
	id: string

	@Column({ type: 'varchar', length: 64 })
	type: string

	@Column({ type: 'varchar', length: 64 })
	provider: string

	@Column({ nullable: true })
	refresh_token: string

	@Column({ nullable: true })
	access_token: string

	@Column({ nullable: true })
	expires_at: number

	@ManyToOne(() => User, user => user.accounts, {
		onDelete: 'CASCADE'
	})
	user: User

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
