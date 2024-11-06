import { ApiProperty } from "@nestjs/swagger";

export class ChangeUserProfileDto {
    @ApiProperty()
    first_name: string
    @ApiProperty()
    second_name: string
    @ApiProperty()
    last_name: string
    @ApiProperty()
    phone: string
    @ApiProperty()
    email: string
    @ApiProperty()
    birth_day: string
    @ApiProperty()
    city: string
    @ApiProperty()
    about_me:string
    @ApiProperty()
    pagination_size:number;
}