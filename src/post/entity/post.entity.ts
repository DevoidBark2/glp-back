import {Column, Entity, ManyToMany, PrimaryGeneratedColumn,JoinTable} from "typeorm";
import {EmojiEntity} from "./emoji.entity";

@Entity('posts')
class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: "varchar"})
    name: string;
    @Column({type: "varchar"})
    image: string;
    @Column({type: "text"})
    content: string;
    @Column({type: "timestamp"})
    publish_date : Date
    @ManyToMany(() => EmojiEntity,{onDelete: "CASCADE"})
    @JoinTable()
    emoji: EmojiEntity[]
}

export default PostEntity;