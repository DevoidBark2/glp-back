import { ApiProperty } from "@nestjs/swagger";
import { CourseComponentType } from "../enum/course-component-type.enum";

export class SaveTaskUserDto {
    @ApiProperty()
    task: CourseComponentType;
    @ApiProperty()
    answers: number[]
}