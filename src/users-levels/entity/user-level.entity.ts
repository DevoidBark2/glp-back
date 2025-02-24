import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { UserLevelEnum } from '../enums/user-level.enum'

@Entity('users-level')
export class UserLevel {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.id, {
		onDelete: 'CASCADE'
	})
	user: User

	@Column({ type: 'int', default: 0 })
	points: number

	@Column({
		type: 'enum',
		enum: UserLevelEnum,
		default: UserLevelEnum.Beginner
	})
	level: UserLevelEnum
}
