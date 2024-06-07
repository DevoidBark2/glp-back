import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
    @Column({type: "date"})
    publish_date : Date
}

export default PostEntity;