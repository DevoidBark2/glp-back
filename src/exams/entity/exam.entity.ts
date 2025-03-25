import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { ExamStatus } from '../enums/status-exam.enum'
import { User } from '../../user/entity/user.entity'
import { ExamsComponent } from './exams-components.entity'
import { CourseEntity } from '../../course/entity/course.entity'
import { ExamUsers } from './exam-users.entity'

@Entity('exams')
export class ExamEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 255 })
	title: string
	@Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.ACTIVE })
	status: ExamStatus
	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User
	@OneToMany(() => ExamsComponent, examComponent => examComponent.exam)
	components: ExamsComponent[]
	@OneToOne(() => ExamUsers, examUser => examUser.exam)
	exam: ExamUsers
	@OneToMany(() => CourseEntity, course => course.exam, {
		onDelete: 'SET NULL'
	})
	course: CourseEntity[]
	@CreateDateColumn()
	created_at: Date
}
