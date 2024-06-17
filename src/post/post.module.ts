import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import PostEntity from "./entity/post.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]),JwtModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
