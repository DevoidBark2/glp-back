import { ApiProperty } from "@nestjs/swagger";

export class SetExamForCourseDto {
    @ApiProperty()
    examId: number
    @ApiProperty()
    courseId: number
}