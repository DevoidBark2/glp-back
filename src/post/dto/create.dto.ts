import {ApiProperty} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty()
    name: string;
    @ApiProperty( {type: "file"} )
    image: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    publish_date: Date
}