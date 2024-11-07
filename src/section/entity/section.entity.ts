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
import { StatusSectionEnum } from '../enum/status_section.enum';

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
  @Column({
    type: 'enum',
    enum: StatusSectionEnum,
    default: StatusSectionEnum.ACTIVE,
  })
  status: StatusSectionEnum;
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
  @ManyToOne(() => CourseEntity, (course) => course.sections, {
    onDelete: 'CASCADE',
  })
  course: CourseEntity;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @CreateDateColumn()
  created_at: Date;
}
