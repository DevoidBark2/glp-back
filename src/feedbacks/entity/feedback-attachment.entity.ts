import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { FeedBackEntity } from './feedback.entity'

@Entity('feedback_attachments')
export class FeedbackAttachmentEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column()
	filename: string

	@Column()
	filepath: string

	@Column()
	mimetype: string

	@ManyToOne(() => FeedBackEntity, feedback => feedback.attachments, {
		onDelete: 'CASCADE'
	})
	feedback: FeedBackEntity
}
