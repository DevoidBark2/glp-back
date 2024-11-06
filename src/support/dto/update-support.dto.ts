import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupportDto } from './create-support.dto';

export class UpdateSupportDto extends PartialType(CreateSupportDto) {
    @ApiProperty()
    answer: string;
}
