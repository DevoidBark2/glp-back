import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseComponentType } from '../enum/course-component-type.enum';
import { User } from '../../user/entity/user.entity';

export type QuestionsType = {
  question: string;
  options: string[];
  correctOption: number;
};
@Entity('component-task')
export class ComponentTask {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: true })
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
  @Column({ type: 'enum', enum: CourseComponentType })
  type: CourseComponentType;
  @Column({ type: 'json', nullable: true })
  questions: QuestionsType;
  @Column({ type: 'text', nullable: true })
  content_description: string;
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
}
