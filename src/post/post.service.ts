import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import PostEntity from './entity/post.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { PostStatusEnum } from './enum/PostStatus.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async getAllPosts() {
    return this.postEntityRepository.find({
      where: {
        status: PostStatusEnum.ACTIVE
      }
    });
  }

  async getUserPosts(user: User) {
    return await this.postEntityRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async createPost(post: CreatePostDto, user: User) {
    return this.postEntityRepository.save({
      id: uuidv4(),
      name: post.name,
      content: post.content,
      image: post.image,
      description: post.description,
      user: user,
    });
  }

  async deletePostById(postId: string) {
    const postDelete = await this.postEntityRepository.findOne({
      where: { id: postId },
    });

    if (!postDelete) {
      throw `Поста с id ${postId} не существует!`;
    }

    await this.postEntityRepository.delete(postDelete.id);
  }

  async submitPreviewPost(postId: number) {
    await this.postEntityRepository.update(postId, {
      status: PostStatusEnum.IN_PROCESSING,
    });
  }

  async getPostById(postId: string) {
    return this.postEntityRepository.findOne({ where: { id: postId } })
  }
}
