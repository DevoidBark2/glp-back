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
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { PostsResponseDto } from './dto/posts-response.dto';

@ApiTags('Посты')
@Controller()
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get('/posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    description: 'List of posts',
    type: PostsResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'List of posts error',
  })
  async getAllPosts(): Promise<PostsResponseDto[]> {
    return await this.postService.getAllPosts();
  }

  @ApiBearerAuth('access-token')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @Get('/posts-user')
  @ApiOperation({ summary: 'Get all posts user' })
  @ApiOkResponse({
    description: 'List of posts',
    type: PostsResponseDto,
    isArray: true,
  })
  async getUserPosts(@Req() req: Request): Promise<PostsResponseDto[]> {
    return this.postService.getUserPosts(req['user']);
  }

  @ApiBearerAuth('access-token')
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
      if (image) {
        post.image = 'uploads/' + image?.filename;
      }

      console.log(post);

      return await this.postService.createPost(post, req['user']);
    } catch (e) {
      throw new BadRequestException(`Ошибка при создании поста: ${e}`);
    }
  }

  @ApiBearerAuth('access-token')
  @Put('/posts/:id')
  @ApiOperation({ summary: 'Change post by ID' })
  async changePost() { }

  @ApiBearerAuth('access-token')
  @ResponseMessage('Пост успешно удален!')
  @Delete('/posts/:id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiHeader({ name: 'authorization' })
  async deletePost(@Param('id') id: string) {
    try {
      await this.postService.deletePostById(id);
    } catch (e) {
      throw new BadRequestException(`Ошибка при удалении поста: ${e}`);
    }
  }

  @ApiBearerAuth('access-token')
  @ResponseMessage('Пост отправлен на проверку, ожидайте подтверждения!')
  @Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
  @Put('/submit-preview')
  async submitPreviewPost(@Query('postId') postId: number) {
    await this.postService.submitPreviewPost(postId);
  }

  @Get('getPostById')
  async getPostById(@Query('postId') postId: string) {
    return await this.postService.getPostById(postId);
  }

  @Roles(UserRole.MODERATOR)
  @Get('posts-for-moderators')
  async getPostForModerators(@Req() req: Request) {
    return await this.postService.getPostForModerators(req['user']);
  }
}
