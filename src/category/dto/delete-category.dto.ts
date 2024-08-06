import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteCategoryDto {
  @IsInt({ message: 'Значение должно быть число!' })
  @IsPositive({ message: 'Значение должно быть больше 0!' })
  @Type(() => Number)
  id: number;
}
