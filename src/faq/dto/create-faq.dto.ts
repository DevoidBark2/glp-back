import { ApiProperty } from "@nestjs/swagger";

export class CreateFaqDto {
    @ApiProperty()
    question: string;
    @ApiProperty()
    answer: string;
}
