import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { ChangeCategoryDto } from './dto/change-category.dto';

@ApiTags('Categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @Get('category')
  @ApiExtraModels(CreateCategoryDto)
  @ApiOkResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(CreateCategoryDto),
    },
  })
  // @ApiBadRequestResponse({
  //   status: 401,
  //   schema: {
  //     $ref: getSchemaPath(BadRequestException),
  //   },
  // })
  async getAll() {
    return this.categoryService.getAll();
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('/category')
  async createCategory(@Body() category: CreateCategoryDto) {
    return await this.categoryService.create(category);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Put('/category')
  @ApiBody({ type: ChangeCategoryDto })
  async changeCategory(@Body() body: ChangeCategoryDto) {
    await this.categoryService.change(body);

    return {
      message: 'Категория упешно обновлена!',
    };
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('/category')
  async deleteCategory(@Query() query: DeleteCategoryDto) {
    return await this.categoryService.delete(query.id);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Post('/possible-delete-category')
  async possibleDeleteCategory(@Body() query: { id: number }) {
    const data = await this.categoryService.isPossibleDeleteCategory(query.id);

    return {
      data: data,
    };
  }
}
