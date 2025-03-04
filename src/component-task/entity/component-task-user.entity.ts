import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
} from 'typeorm'
import { ComponentTask } from './component-task.entity'
import { User } from '../../user/entity/user.entity'
import { SectionEntity } from 'src/section/entity/section.entity'
import { CourseUser } from '../../course/entity/course-user.entity'

@Entity('answers_component_user')
export class AnswersComponentUser {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User

	@ManyToOne(() => ComponentTask, task => task.id, {
		onDelete: 'CASCADE',
		nullable: true
	})
	task: ComponentTask

	@ManyToOne(() => SectionEntity, section => section.id, {
		onDelete: 'CASCADE'
	})
	section: SectionEntity

	@Column({ type: 'json', nullable: false })
	answer: any // Содержит ответ пользователя (можно использовать объект для хранения данных)

	@CreateDateColumn()
	created_at: Date

	@ManyToOne(() => CourseUser, courseUser => courseUser.id, {
		onDelete: 'CASCADE'
	})
	courseUser: CourseUser
}
