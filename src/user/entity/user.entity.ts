import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
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
    @Column()
    birth_day: Date;
    @Column()
    otp_code: string
    @Column()
    role: string
}