import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from './entity/category.entity'
import { CourseEntity } from '../course/entity/course.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, CourseEntity])],
	controllers: [CategoryController],
	providers: [CategoryService]
})
export class CategoryModule {}
