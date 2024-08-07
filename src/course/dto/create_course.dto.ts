import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Название обязательно!' })
  @IsString({ message: 'Название должно быть строкой' })
  name: string;
  @ApiProperty()
  small_description: string;
  @ApiProperty({ type: 'file' })
  image: string;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Категория обязательно!' })
  @IsString({ message: 'Категория должна быть числом' })
  category: number;
  @ApiProperty({ type: 'number' })
  @IsNotEmpty({ message: 'Права обязательно!' })
  @IsString({ message: 'Права должны быть числом' })
  access_right: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Время обязательно!' })
  @IsString({ message: 'Время должно быть числом' })
  duration: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Уровень сложности обязательно!' })
  @IsString({ message: 'Уровень сложности должно быть числом' })
  level: number;
  @ApiProperty({
    type: 'date',
    format: 'YYYY-MM-DD HH:mm',
  })
  @ApiProperty()
  content_description: string;
  publish_date: Date;
}
