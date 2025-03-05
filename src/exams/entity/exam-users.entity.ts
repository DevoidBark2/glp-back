import {
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { ExamEntity } from './exam.entity'
import { User } from '../../user/entity/user.entity'

@Entity('exams_users')
export class ExamUsers {
	@PrimaryGeneratedColumn()
	id: number
	@ManyToOne(() => ExamEntity, exam => exam.id)
	exam: ExamEntity
	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User
	@CreateDateColumn()
	createdAt: Date
}
