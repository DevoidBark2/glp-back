import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import PostEntity from './entity/post.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { PostStatusEnum } from './enum/PostStatus.enum';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from 'src/constants/contants';
import { PublishPostDto } from './dto/publish-post.dro';
import { ChangePostDto } from './dto/change-post.dto';
import { ModeratorsPost } from './entity/moderators-post.entity';
import { UpdatePostStatus } from './dto/update-post-status.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ModeratorsPost) private readonly moderatorPostRepository: Repository<ModeratorsPost>,
    private readonly jwtService: JwtService,
  ) { }

  async getAllPosts() {
    return this.postEntityRepository.find({
      where: {
        is_publish: true
      }
    });
  }

  async getUserPosts(user: User) {
    if (user.role === UserRole.SUPER_ADMIN) {
      return await this.postEntityRepository.find({
        relations: {
          user: true
        },
        order: {
          user: {
            role: "DESC"
          }
        }
      });
    }
    return await this.postEntityRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // Присоединяем таблицу пользователя
      .leftJoinAndMapOne(
        'post.moderatorFeedBack',         // Маппим новое поле `moderatorsPost` на сущность поста
        'moderators_posts',            // Имя таблицы `moderators_posts`
        'mp',                          // Алиас для таблицы `moderators_posts`
        'mp.post_id = post.id'         // Условие соединения по post_id
      )
      .addSelect(['mp.comment', 'mp.comments']) // Включаем нужные поля из `moderators_posts`
      .where('user.id = :userId', { userId: user.id }) // Фильтрация по пользователю
      .getMany();
  }

  async createPost(post: CreatePostDto, user: User) {
    return this.postEntityRepository.save({
      name: post.name,
      content: post.content,
      image: post.image,
      description: post.description,
      user: user,
      status: post.status,
      is_publish: post.is_publish
    });
  }

  async deletePostById(postId: number) {
    const postDelete = await this.postEntityRepository.findOne({
      where: { id: postId },
    });

    if (!postDelete) {
      throw `Поста с id ${postId} не существует!`;
    }

    await this.postEntityRepository.delete(postDelete.id);
  }

  async submitPreviewPost(postId: number) {
    // генерация для присвоения поста модератору
    await this.randomAssignPost(postId);
    await this.postEntityRepository.update(postId, {
      status: PostStatusEnum.IN_PROCESSING,
    });
  }

  async getPostById(postId: number) {
    return this.postEntityRepository.findOne({ where: { id: postId } })
  }

  async getPostForModerators(user: User) {
    const moderatorPosts = await this.moderatorPostRepository.find({
      where: {
        user: { id: user.id },
        post: { status: PostStatusEnum.IN_PROCESSING }
      },
      relations: {
        post: {
          user: true
        },
      },
    });

    // Форматируем данные вручную под структуру postMapper
    return moderatorPosts.map(moderatorPost => ({
      id: moderatorPost.post.id,
      name: moderatorPost.post.name,
      image: moderatorPost.post.image,
      description: moderatorPost.post.description,
      content: moderatorPost.post.content,
      status: moderatorPost.post.status,
      is_publish: moderatorPost.post.is_publish,
      created_at: moderatorPost.post.created_at,
      user: {
        id: moderatorPost.post.user.id,
        first_name: moderatorPost.post.user.first_name,
        second_name: moderatorPost.post.user.second_name,
        last_name: moderatorPost.post.user.last_name,
        phone: moderatorPost.post.user.last_name,
        role: moderatorPost.post.user.role,
        status: moderatorPost.post.user.status,
        email: moderatorPost.post.user.email,
        created_at: moderatorPost.post.user.created_at
      }
    }));


    // return await this.postEntityRepository.find({
    //   where: {
    //     status: PostStatusEnum.IN_PROCESSING
    //   },
    //   relations: {
    //     user: true
    //   }
    // })
  }

  async publishPost(body: PublishPostDto) {
    const post = await this.postEntityRepository.findOne({
      where: { id: body.id }
    })

    if (!post) {
      throw new BadRequestException(`Поста с ID ${body.id} не существует!`)
    }

    await this.postEntityRepository.update(body.id, { is_publish: body.checked })

    return {
      message: body.checked ? "Пост успешно опубликован!" : "Пост снят с публикации!"
    }
  }

  async changePost(post: ChangePostDto, user: User) {
    const currentPost = await this.postEntityRepository.findOne({
      where: {
        id: post.id
      }
    })

    if (!currentPost) {
      throw new BadRequestException(`Поста с ID ${post.id} не существует!`)
    }

    if (post !== currentPost) {
      post.is_publish = false;
      post.status = PostStatusEnum.MODIFIED;

      await this.postEntityRepository.update(post.id, post);

      return {
        post: post,
        message: post.status && currentPost.status !== post.status && "Пост снят с публикации, так как статус изменился!"
      };
    }

    if (post.status && currentPost.status !== post.status) {
      post.is_publish = false;
    }
    await this.postEntityRepository.update(post.id, post);

    return {
      post: post,
      message: post.status && currentPost.status !== post.status && "Пост снят с публикации, так как статус изменился!"
    };
  }

  async updatePostStatus(body: UpdatePostStatus) {
    await this.postEntityRepository.update(body.postId, { status: body.status })
    const moderatorPost = await this.moderatorPostRepository.findOne({
      where: {
        post: { id: body.postId }
      }
    })
    await this.moderatorPostRepository.update(moderatorPost.id, { comment: body.comment, comments: body.comments })
  }

  private async randomAssignPost(postId: number) {
    const moderators = await this.userRepository.find({
      where: {
        role: UserRole.MODERATOR
      }
    })

    const randomModerator = moderators[Math.floor(Math.random() * moderators.length)];
    await this.moderatorPostRepository.save({
      user: randomModerator,
      post: { id: postId } as PostEntity,
    });
  }
}
