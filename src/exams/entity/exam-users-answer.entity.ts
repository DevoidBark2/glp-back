import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../../user/entity/user.entity'
import { ComponentTask } from '../../component-task/entity/component-task.entity'
import { SectionEntity } from '../../section/entity/section.entity'
import { CourseUser } from '../../course/entity/course-user.entity'

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

	@Column({ type: 'json', nullable: false })
	answer: any

	@CreateDateColumn()
	created_at: Date
}
