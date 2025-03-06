import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { ExamEntity } from './exam.entity'
import { User } from '../../user/entity/user.entity'

@Entity('exams_users')
export class ExamUsers {
	@PrimaryGeneratedColumn()
	id: number
	@OneToOne(() => ExamEntity, exam => exam.id)
	@JoinColumn()
	exam: ExamEntity
	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User
	@CreateDateColumn()
	startExamAt: Date
	@Column({ type: "timestamp", })
	endExamAt: Date
}
