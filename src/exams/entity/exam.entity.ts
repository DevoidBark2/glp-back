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
	@OneToMany(() => ExamsComponent, examComponent => examComponent.id, {
		onDelete: 'CASCADE'
	})
	components: ExamsComponent[]
	@CreateDateColumn()
	created_at: Date
}
