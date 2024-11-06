import { ApiProperty } from "@nestjs/swagger";

export class CreateSupportDto {
    @ApiProperty()
    customerName: string;
    @ApiProperty()
    customerEmail?: string;
    @ApiProperty()
    question: string;
}
