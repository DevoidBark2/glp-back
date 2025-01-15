import {
	Column,
	Entity,
	ManyToMany,
	JoinTable,
	ManyToOne,
	CreateDateColumn,
	PrimaryGeneratedColumn
} from 'typeorm'
import { EmojiEntity } from './emoji.entity'
import { User } from '../../user/entity/user.entity'
import { PostStatusEnum } from '../enum/PostStatus.enum'

@Entity('posts')
class PostEntity {
	@PrimaryGeneratedColumn()
	id: number
	@Column({ type: 'varchar', length: 100 })
	name: string
	@Column({ type: 'varchar', nullable: true })
	image: string
	@Column({ type: 'text' })
	content: string
	@Column({ type: 'varchar', nullable: true, length: 255 })
	description: string
	@Column({ type: 'enum', enum: PostStatusEnum, default: PostStatusEnum.NEW })
	status: PostStatusEnum
	@Column({ type: 'boolean', default: false })
	is_publish: boolean
	@CreateDateColumn()
	created_at: Date
	@ManyToMany(() => EmojiEntity, { onDelete: 'CASCADE' })
	@JoinTable()
	emoji: EmojiEntity[]
	@ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
	user: User
}

export default PostEntity
