import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';
import { ComponentTask } from '../../component-task/entity/component-task.entity';
import { User } from '../../user/entity/user.entity';

@Entity('sections')
export class SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'json', nullable: true })
  externalLinks: string[];
  @Column({ type: 'json', nullable: true })
  uploadFile: string[];
  @ManyToMany(() => ComponentTask, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'section_component_task',
    joinColumn: { name: 'section_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'component_task_id',
      referencedColumnName: 'id',
    },
  })
  components: ComponentTask[];
  @ManyToOne(() => CourseEntity, (course) => course.sections)
  course: CourseEntity;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @CreateDateColumn()
  created_at: Date;
}
