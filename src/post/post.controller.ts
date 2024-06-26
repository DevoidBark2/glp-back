import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {PostService} from './post.service';
import {ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {CreatePostDto} from "./dto/create.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOptions} from "../config/multerConfig";

@ApiTags('Посты')
@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/posts')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({type: CreatePostDto})
  @ApiQuery({ name: 'token', description: 'Token' })
  async createPost(@Body() post : CreatePostDto,@Query() token: string,@UploadedFile() image : Express.Multer.File){
    try{
      post.image = "/uploads/" + image.filename;
      const newPost = await this.postService.createPost(post)
      return {
        success: true,
        post: newPost,
        message: "Пост успешно добавлен!"
      }
    }catch (e){
      throw new BadRequestException(`Ошибка при создании поста: ${e}`)
    }
  }

  @Get('/posts')
  @ApiQuery({ name: 'token', description: 'Authorization token' })
  async getAllPosts(@Query('token') token: string){
    return this.postService.getAllPosts(token);
  }
}
