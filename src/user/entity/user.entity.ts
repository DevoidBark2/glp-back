import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('users')
export class User{
    @PrimaryColumn()
    id:number;
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
    @Column({default: false})
    is_active: boolean
    @OneToOne(() => Role, (role) => role.id)
    role_id: number
}