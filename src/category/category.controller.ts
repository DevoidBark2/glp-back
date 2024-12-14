import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { CreateCategoryDto } from './dto/create-category.dto'
import {
	ApiBody,
	ApiExtraModels,
	ApiOkResponse,
	ApiTags
} from '@nestjs/swagger'
import { DeleteCategoryDto } from './dto/delete-category.dto'
import { ChangeCategoryDto } from './dto/change-category.dto'
import { CategoryEntity } from './entity/category.entity'

@ApiTags('Categories')
@Controller()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get('category')
	@ApiExtraModels(CreateCategoryDto)
	@ApiOkResponse({
		status: 200,
		type: CreateCategoryDto,
		isArray: true
	})
	async getAll(): Promise<CategoryEntity[]> {
		return this.categoryService.getAll()
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Post('/category')
	async createCategory(@Body() category: CreateCategoryDto) {
		const createdCategory = await this.categoryService.create(category)
		return {
			category: createdCategory,
			message: 'Категория успешно создана!'
		}
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Put('/category')
	@ApiBody({ type: ChangeCategoryDto })
	async changeCategory(@Body() body: ChangeCategoryDto) {
		await this.categoryService.change(body)

		return {
			message: 'Категория упешно обновлена!'
		}
	}

	@Roles(UserRole.SUPER_ADMIN)
	@Delete('/category')
	async deleteCategory(@Query() query: DeleteCategoryDto) {
		return await this.categoryService.delete(query.id)
	}
}
