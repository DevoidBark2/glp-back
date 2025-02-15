import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm'
import { ExamStatus } from '../enums/status-exam.enum'
import { User } from '../../user/entity/user.entity'
import { ExamsComponent } from './exams-components.entity'
import { CourseEntity } from '../../course/entity/course.entity'

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
	@OneToMany(() => ExamsComponent, examComponent => examComponent.exam, {
		onDelete: 'CASCADE'
	})
	components: ExamsComponent[]
	@OneToMany(() => CourseEntity, course => course.exam, {
		onDelete: 'CASCADE'
	})
	course: CourseEntity[]
	@CreateDateColumn()
	created_at: Date
}
