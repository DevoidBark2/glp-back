import { ApiProperty } from "@nestjs/swagger";

export class PostsResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    status: string;
    @ApiProperty()
    is_publish: boolean;
    @ApiProperty()
    created_at: Date
}