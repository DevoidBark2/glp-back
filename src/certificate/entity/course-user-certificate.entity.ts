import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { CourseEntity } from '../../course/entity/course.entity'

@Entity('course_user_certificate')
export class CourseUserCertificateEntity {
	@PrimaryGeneratedColumn()
	id: number
	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User
	@ManyToOne(() => CourseEntity, course => course.id, { onDelete: 'CASCADE' })
	course: CourseEntity
	@CreateDateColumn()
	created_at: Date
}
