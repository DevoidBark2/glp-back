import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn
} from 'typeorm'
import { CourseComponentType } from '../enum/course-component-type.enum'
import { User } from '../../user/entity/user.entity'
import { StatusComponentTaskEnum } from '../enum/status-component-task.enum'
import { SectionComponentTask } from 'src/section/entity/section-component-task.entity'
import { AnswersComponentUser } from './component-task-user.entity'

export type QuestionsType = {
	id: string
	question: string
	options: string[]
	correctOption?: number | number[]
}
@Entity('components')
export class ComponentTask {
	@PrimaryColumn({ type: 'uuid' })
	id: string

	@Column({ type: 'varchar', nullable: true })
	title: string

	@Column({ type: 'varchar', length: 255, nullable: true })
	description: string

	@Column({ type: 'enum', enum: CourseComponentType })
	type: CourseComponentType

	@Column({ type: 'json', nullable: true })
	questions: QuestionsType[]

	@Column({ type: 'text', nullable: true })
	content_description: string

	@CreateDateColumn()
	created_at: Date

	@Column({
		type: 'enum',
		enum: StatusComponentTaskEnum,
		default: StatusComponentTaskEnum.ACTIVATED
	})
	status: StatusComponentTaskEnum

	@ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
	user: User

	@Column({ type: 'numeric', nullable: true })
	sort: number

	@OneToMany(
		() => SectionComponentTask,
		sectionComponent => sectionComponent.componentTask
	)
	sectionComponents: SectionComponentTask[]

	@ManyToOne(() => AnswersComponentUser, user => user.id, {
		onDelete: 'CASCADE'
	})
	userAnswer: AnswersComponentUser

	@Column({ type: 'varchar', nullable: true })
	answer: string
}
