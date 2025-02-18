import { User } from 'src/user/entity/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { CourseEntity } from './course.entity'

@Entity('course-users')
export class CourseUser {
	@PrimaryGeneratedColumn()
	id: number
	@ManyToOne(() => User, user => user.id, {
		onDelete: 'CASCADE'
	})
	user: User
	@ManyToOne(() => CourseEntity, course => course.id, {
		onDelete: 'CASCADE'
	})
	course: CourseEntity

	@CreateDateColumn()
	enrolledAt: Date

	@UpdateDateColumn()
	lastUpdated: Date

	@Column({ type: 'numeric', default: 0 })
	progress: number
}
