import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseComponentType } from '../enum/course-component-type.enum';
import { User } from '../../user/entity/user.entity';
import { StatusComponentTaskEnum } from '../enum/status-component-task.enum';
import { SectionEntity } from '../../section/entity/section.entity';
import { SectionComponentTask } from 'src/section/entity/section-component-task.entity';

export type QuestionsType = {
  question: string;
  options: string[];
  correctOption: number;
};
@Entity('component_task')
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
  questions: QuestionsType[];
  @Column({ type: 'text', nullable: true })
  content_description: string;
  @CreateDateColumn()
  created_at: Date;
  @Column({
    type: 'enum',
    enum: StatusComponentTaskEnum,
    default: StatusComponentTaskEnum.ACTIVATED,
  })
  status: StatusComponentTaskEnum;
  @Column({ type: 'json', nullable: true })
  tags: string[];
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;
  // @ManyToMany(() => SectionEntity, (section) => section.components)
  // sections: SectionEntity[];
  @Column({ type: "numeric", nullable: true })
  sort: number
  @OneToMany(() => SectionComponentTask, (sectionComponent) => sectionComponent.componentTask)
  sectionComponents: SectionComponentTask[];
}
