import { User } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('feedbacks')
export class FeedBackEntity {
    @PrimaryColumn({type: "uuid"})
    id: string;
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    sender: User;
    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    recipient: User;
    @Column({type: "text"})
    message: string
    @CreateDateColumn()
    sent_at: Date
}