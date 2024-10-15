import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { FeedbackAttachmentEntity } from './feedback-attachment.entity';

@Entity('feedbacks')
export class FeedBackEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  sender: User;
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  recipient: User;
  @Column({ type: 'text' })
  message: string;
  @CreateDateColumn()
  sent_at: Date;
  @OneToMany(
    () => FeedbackAttachmentEntity,
    (attachment) => attachment.feedback,
    { cascade: true },
  )
  attachments: FeedbackAttachmentEntity[];
}
