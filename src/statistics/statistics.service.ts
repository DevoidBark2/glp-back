import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostEntity from '../post/entity/post.entity';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { CourseEntity } from '../course/entity/course.entity';
import { SectionEntity } from '../section/entity/section.entity';
import { UserRole } from '../constants/contants';
import { PostStatusEnum } from '../post/enum/PostStatus.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CourseEntity)
    private readonly courseEntityRepository: Repository<CourseEntity>,
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(SectionEntity)
    private readonly sectionEntityRepository: Repository<SectionEntity>,
  ) {}

  async globalSearch(text: string, user: User) {
    if (user.role === UserRole.SUPER_ADMIN) {
      const posts = await this.postEntityRepository.find({
        where: { name: ILike(`%${text}%`) },
      });

      const courses = await this.courseEntityRepository.find({
        where: {
          name: ILike(`%${text}%`),
        },
      });

      return {
        courses: courses,
        posts: posts,
      };
    }

    const posts = await this.postEntityRepository.find({
      where: { name: ILike(`%${text}%`), user: { id: user.id } },
    });

    const courses = await this.courseEntityRepository.find({
      where: {
        name: ILike(`%${text}%`),
        user: { id: user.id },
      },
    });

    return {
      courses: courses,
      posts: posts,
    };
  }

  async getStatistics(user: User) {
    const courseCount = await this.courseEntityRepository.count({
      where: { user: { id: user.id } },
    });

    const postCount = await this.postEntityRepository.count({
      where: { user: { id: user.id } },
    });

    const publishPosts = await this.postEntityRepository.count({
      where: {
        is_publish: true,
        user: { id: user.id },
      },
    });

    const newPosts = await this.postEntityRepository.count({
      where: {
        user: { id: user.id },
        status: PostStatusEnum.NEW,
      },
    });

    const inProcessingPosts = await this.postEntityRepository.count({
      where: {
        user: { id: user.id },
        status: PostStatusEnum.IN_PROCESSING,
      },
    });

    const rejectPosts = await this.postEntityRepository.count({
      where: {
        user: { id: user.id },
        status: PostStatusEnum.REJECT,
      },
    });

    return {
      courseCount: courseCount,
      postCount: postCount,
      postsCountPublish: ((publishPosts / postCount) * 100).toFixed(2),
      postsCountNew: ((newPosts / postCount) * 100).toFixed(2),
      postsCountIsProcessing: ((inProcessingPosts / postCount) * 100).toFixed(
        2,
      ),
      postsCountReject: ((rejectPosts / postCount) * 100).toFixed(2),
    };
  }
}
