import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';

@Entity('sections')
export class SectionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  title: string;
  @ManyToOne(() => CourseEntity, (course) => course.sections)
  course: CourseEntity;
}
