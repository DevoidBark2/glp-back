import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { ComponentTask } from '../../component-task/entity/component-task.entity'
import { CourseEntity } from '../../course/entity/course.entity'

@Entity('exam_answers_user')
export class ExamUsersAnswerEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => ComponentTask, task => task.id, {
		onDelete: 'CASCADE',
		nullable: true
	})
	task: ComponentTask

	@ManyToOne(() => CourseEntity, course => course.id, { onDelete: 'CASCADE' })
	course: CourseEntity

	@Column({ type: 'json', nullable: false })
	answer: any

	@CreateDateColumn()
	created_at: Date
}
