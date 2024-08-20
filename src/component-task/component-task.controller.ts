import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ComponentTaskService } from './component-task.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateComponentTaskDto } from './dto/create-component-task.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';
import { ResponseComponentTaskInterceptor } from '../interceptors/response-component-task.interceptor';
import { ResponseMessage } from '../decorators/response-message.decorator';

@ApiTags('Компоненты раздела')
@Controller('')
export class ComponentTaskController {
  constructor(private readonly componentTaskService: ComponentTaskService) {}

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('/component-task')
  async getComponentTask(@Req() req: Request) {
    return await this.componentTaskService.getAll(req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Post('/component-task')
  @UseInterceptors(ResponseComponentTaskInterceptor)
  async createComponentTask(
    @Body() body: CreateComponentTaskDto,
    @Req() req: Request,
  ) {
    const component = await this.componentTaskService.create(body, req['user']);

    return {
      message: 'Компонент успешно создан!',
      component: component,
    };
  }

  @ResponseMessage('Компонент успешно обновлен!')
  @Put('/component-task')
  async changeComponentTask(
    @Req() req: Request,
    @Body() body: CreateComponentTaskDto,
  ) {
    await this.componentTaskService.change(body, req['user']);
  }

  @ResponseMessage('Компонент успешно удален!')
  @Delete('/component-task/:id')
  async deleteComponentTask(@Param('id') id: number, @Req() req: Request) {
    await this.componentTaskService.delete(id, req['user']);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('/search-components')
  async getSearchComponents(
    @Query() query: { query: string },
    @Req() req: Request,
  ) {
    return await this.componentTaskService.searchComponent(
      query.query,
      req['user'],
    );
  }
}
