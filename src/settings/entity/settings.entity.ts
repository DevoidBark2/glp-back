import {Column, Entity, OneToOne, PrimaryGeneratedColumn,JoinColumn} from "typeorm";
import {User} from "../../user/entity/user.entity";
import {TYPES_VERTEX} from "../enum/type_vertex.enum";

@Entity('settings')
export class SettingsEntity{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type: "text",default: "green"})
    vertex_color: string;
    @Column({type: "text",default: "red"})
    edge_color: string;
    @Column({type:"enum",enum: TYPES_VERTEX,default: TYPES_VERTEX.CIRCLE})
    type_vertex: string;
    @Column({type: "text", default: "black"})
    border_vertex: string;
    @OneToOne(() => User)
    @JoinColumn()
    user: User
}