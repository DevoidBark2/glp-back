import {BadRequestException, Injectable} from '@nestjs/common';
import {CreatePostDto} from "./dto/create.dto";
import {InjectRepository} from "@nestjs/typeorm";
import PostEntity from "./entity/post.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) private readonly postEntityRepository: Repository<PostEntity>,
        private readonly jwtService: JwtService
    ) {}

    async createPost(post:CreatePostDto){
        return this.postEntityRepository.save(post);
    }

    async getAllPosts(token: string){
        const decodedToken = await this.jwtService.decode(token);

        if(!decodedToken){
            throw new BadRequestException("Ошибка при получении данных!")
        }

        return this.postEntityRepository.find();
    }
}
