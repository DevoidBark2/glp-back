import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique
} from 'typeorm'
import { Achievement } from './achievement.entity'
import { User } from 'src/user/entity/user.entity'

@Entity('achievements_users')
@Unique(['user', 'achievement'])
export class AchievementUser {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.achievements, { onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => Achievement, { onDelete: 'CASCADE' })
	achievement: Achievement

	@Column({ type: 'numeric', default: 0 })
	progress: number

	@Column({ type: 'boolean', default: false })
	completed: boolean

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date

	@Column({ type: 'timestamp', nullable: true })
	completedAt: Date | null
}
