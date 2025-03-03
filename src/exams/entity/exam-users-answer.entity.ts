import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('exam_answers_user')
export class ExamUsersAnswerEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'json', nullable: false })
	answer: any
}
