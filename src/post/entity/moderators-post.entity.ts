import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import PostEntity from "./post.entity";

@Entity('moderators_posts')
export class ModeratorsPost {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => PostEntity, post => post.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;

    @Column({ type: "varchar", nullable: true })
    comment: string;
    @Column({ type: "json", nullable: true })
    comments: string[]
}