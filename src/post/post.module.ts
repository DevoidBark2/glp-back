import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostEntity from './entity/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { ModeratorsPost } from './entity/moderators-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, User, ModeratorsPost]),
    JwtModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
