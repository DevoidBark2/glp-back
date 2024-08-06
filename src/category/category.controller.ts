import {
  BadRequestException,
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
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DeleteCategoryDto } from './dto/delete-category.dto';
import { ChangeCategoryDto } from './dto/change-category.dto';
import { CategoryEntity } from './entity/category.entity';
import { BasicResponse } from '../types/BasicResponse';

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
    return await this.categoryService.change(body);
  }

  @Roles(UserRole.SUPER_ADMIN)
  @Delete('/category')
  async deleteCategory(@Query() query: DeleteCategoryDto) {
    return await this.categoryService.delete(query.id);
  }
}
