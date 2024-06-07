import {BadRequestException, Body, Controller, Param, Post} from '@nestjs/common';
import { PostService } from './post.service';
import {ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {CreatePostDto} from "./dto/create.dto";

@ApiTags('Посты')
@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create-post')
  @ApiBody({type: CreatePostDto})
  @ApiParam({ name: 'token', description: 'Token' })
  async createPost(@Body() post : CreatePostDto,@Param() token: string){
    try{
      await this.postService.createPost(post)
      return {
        success: true,
        message: "Пост успешно добавлен!"
      }
    }catch (e){
      throw new BadRequestException(`Ошибка при создании поста: ${e}`)
    }
  }
}
