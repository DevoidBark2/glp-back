import { Expose } from 'class-transformer';
import { CourseEntity } from '../../course/entity/course.entity';
import PostEntity from '../../post/entity/post.entity';

export class UserDetailsByIdDto {
  @Expose()
  id: number;
  @Expose()
  first_name: string;
  @Expose()
  second_name: string;
  @Expose()
  last_name: string;
  @Expose()
  role: string;
  @Expose()
  email: string;
  @Expose()
  is_active: boolean;
  @Expose()
  city: string;
  @Expose()
  university: string;
  @Expose()
  birth_day: Date;
  @Expose()
  created_at: Date;
  @Expose()
  updated_at: Date;
  @Expose()
  courses: CourseEntity;
  @Expose()
  posts: PostEntity;
}
