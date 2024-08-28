import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { EmojiEntity } from './emoji.entity';
import { User } from '../../user/entity/user.entity';
import { PostStatusEnum } from '../enum/PostStatus.enum';

@Entity('posts')
class PostEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  image: string;
  @Column({ type: 'text' })
  content: string;
  @Column({ type: 'text' })
  description: string;
  @Column({ type: 'enum', enum: PostStatusEnum, default: PostStatusEnum.NEW })
  status: PostStatusEnum;
  @Column({ type: 'boolean', default: false })
  is_publish: boolean;
  @CreateDateColumn()
  created_at: Date;
  @ManyToMany(() => EmojiEntity, { onDelete: 'CASCADE' })
  @JoinTable()
  emoji: EmojiEntity[];
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}

export default PostEntity;
