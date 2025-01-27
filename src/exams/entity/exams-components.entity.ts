import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm'
import { ExamEntity } from './exam.entity'
import { ComponentTask } from '../../component-task/entity/component-task.entity'

@Entity('exams-components')
export class ExamsComponent {
	@PrimaryGeneratedColumn()
	id: number
	@ManyToOne(() => ExamEntity, exam => exam.id, { onDelete: 'CASCADE' })
	@JoinColumn()
	exam: ExamEntity

	@ManyToOne(() => ComponentTask, component => component.id, {
		onDelete: 'CASCADE'
	})
	component: ComponentTask

	@Column({ type: 'int' })
	sort: number
}
