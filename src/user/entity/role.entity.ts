import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('roles')
export class Role{
    @PrimaryColumn()
    id:number;
    @Column()
    name: string;
}