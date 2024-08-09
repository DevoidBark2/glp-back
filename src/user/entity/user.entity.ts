import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';
import PostEntity from '../../post/entity/post.entity';
import { UserRole } from '../../constants/contants';
import { SettingsEntity } from '../../settings/entity/settings.entity';

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
  @Column({ nullable: true })
  otp_code: string;
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
  @OneToMany(() => CourseEntity, (course) => course.user)
  @JoinColumn()
  courses: CourseEntity[];
  @OneToMany(() => PostEntity, (post) => post.user)
  @JoinColumn()
  posts: PostEntity[];
  @OneToOne(() => SettingsEntity, (settings) => settings.user)
  settings: SettingsEntity;
}
