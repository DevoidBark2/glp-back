import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';

import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multerConfig';
import PostEntity from './entity/post.entity';
import { ResponseMessage } from '../decorators/response-message.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../constants/contants';

@ApiTags('Posts')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    description: 'List of posts',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CreatePostDto) },
    },
  })
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postService.getAllPosts();
  }

  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Post('/posts')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiHeader({ name: 'authorization' })
  @ResponseMessage('Пост успешно создан!')
  async createPost(
    @Body() post: CreatePostDto,
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      post.image = '/uploads/' + '';
      return await this.postService.createPost(post, req['user']);
    } catch (e) {
      throw new BadRequestException(`Ошибка при создании поста: ${e}`);
    }
  }

  @Put('/posts/:id')
  @ApiOperation({ summary: 'Change post by ID' })
  async changePost() {}

  @Delete('/posts/:id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiHeader({ name: 'authorization' })
  async deletePost(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: number,
  ) {
    try {
      await this.postService.deletePostById(id);
    } catch (e) {
      throw new BadRequestException(`Ошибка при удалении поста: ${e}`);
    }
  }
}
