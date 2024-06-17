import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto{
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    second_name: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    city: string;
    @ApiProperty()
    university: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    birth_day: Date;
}