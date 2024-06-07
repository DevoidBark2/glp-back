import { Injectable } from '@nestjs/common';
import {CreatePostDto} from "./dto/create.dto";
import {InjectRepository} from "@nestjs/typeorm";
import PostEntity from "./entity/post.entity";
import {Repository} from "typeorm";
@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postEntityRepository: Repository<PostEntity>,
    ) {}

    async createPost(post:CreatePostDto){
        return this.postEntityRepository.save(post);
    }
}
