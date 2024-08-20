import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import PostEntity from './entity/post.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getAllPosts() {
    return this.postEntityRepository.find();
  }

  async createPost(post: CreatePostDto, token: any) {
    const decodedToken = await this.jwtService.decode(token);

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      throw `Пользователя с id ${decodedToken.id} не существует!`;
    }

    const newPost = this.postEntityRepository.create({
      name: post.name,
      content: post.content,
      image: post.image,
      user: user,
    });

    return this.postEntityRepository.save(newPost);
  }

  async deletePostById(postId: number) {
    // const decodedToken = await this.jwtService.decode('asdsad');
    //
    // const user = await this.userRepository.findOne({
    //   where: { id: decodedToken.id },
    // });
    //
    // if (!user) {
    //   throw `Пользователя с id ${decodedToken.id} не существует!`;
    // }

    const postDelete = await this.postEntityRepository.findOne({
      where: { id: postId },
    });

    if (!postDelete) {
      throw `Поста с id ${postId} не существует!`;
    }

    await this.postEntityRepository.delete(postDelete);
  }
}
