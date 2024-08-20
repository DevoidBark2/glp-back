import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { EmojiEntity } from './emoji.entity';
import { User } from '../../user/entity/user.entity';

@Entity('posts')
class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  image: string;
  @Column({ type: 'text' })
  content: string;
  @CreateDateColumn()
  publish_date: Date;
  @ManyToMany(() => EmojiEntity, { onDelete: 'CASCADE' })
  @JoinTable()
  emoji: EmojiEntity[];
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}

export default PostEntity;
