import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';
import PostEntity from '../../post/entity/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  first_name: string;
  @Column()
  second_name: string;
  @Column()
  last_name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  city: string;
  @Column()
  university: string;
  @Column({ default: false })
  is_active: boolean;
  @Column()
  birth_day: Date;
  @Column()
  otp_code: string;
  @Column()
  role: string;
  @OneToMany(() => CourseEntity, (course) => course.user)
  @JoinColumn()
  courses: CourseEntity[];
  @OneToMany(() => PostEntity, (post) => post.user)
  @JoinColumn()
  posts: PostEntity[];
}
