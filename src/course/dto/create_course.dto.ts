import {ApiProperty} from "@nestjs/swagger";

export class CreateCourseDto{
    @ApiProperty()
    name: string;
    @ApiProperty()
    description:string;
    @ApiProperty({type: "file"})
    image: string
    @ApiProperty({type: "number"})
    category: number
    @ApiProperty({type: "number"})
    access_right: number
    @ApiProperty()
    duration: number
    @ApiProperty()
    level:number
    @ApiProperty({
        type: 'date',
        format: 'YYYY-MM-DD HH:mm'
    })
    publish_date: Date
}