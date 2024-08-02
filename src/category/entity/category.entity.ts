import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToOne(() => CourseEntity, (course) => course.category)
  course: CourseEntity;
}
