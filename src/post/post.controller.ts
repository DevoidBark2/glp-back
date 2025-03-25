import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { PostService } from './post.service'

import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiHeader,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger'
import { CreatePostDto } from './dto/create.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '../config/multerConfig'
import { ResponseMessage } from '../decorators/response-message.decorator'
import { Roles } from '../decorators/roles.decorator'
import { UserRole } from '../constants/contants'
import { PostsResponseDto } from './dto/posts-response.dto'
import { PublishPostDto } from './dto/publish-post.dro'
import { ChangePostDto } from './dto/change-post.dto'
import { UpdatePostStatus } from './dto/update-post-status.dto'
import { Authorization } from 'src/auth/decorators/auth.decorator'

@ApiTags('Посты')
@Controller()
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get('/posts')
	@ApiOperation({ summary: 'Get all posts' })
	@ApiOkResponse({
		description: 'List of posts',
		type: PostsResponseDto,
		isArray: true
	})
	@ApiBadRequestResponse({
		description: 'List of posts error'
	})
	async getAllPosts(): Promise<PostsResponseDto[]> {
		return await this.postService.getAllPosts()
	}

	@ApiBearerAuth('access-token')
	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER)
	@Get('/posts-user')
	@ApiOperation({ summary: 'Get all posts user' })
	@ApiOkResponse({
		description: 'List of posts',
		type: PostsResponseDto,
		isArray: true
	})
	async getUserPosts(@Req() req: Request): Promise<PostsResponseDto[]> {
		return this.postService.getUserPosts(req['user'])
	}

	@ApiBearerAuth('access-token')
	@Authorization(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Post('/posts')
	@UseInterceptors(FileInterceptor('image', multerOptions))
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Create new post' })
	@ApiBody({ type: CreatePostDto })
	@ApiHeader({ name: 'authorization' })
	@ResponseMessage('Пост успешно создан!')
	async createPost(
		@Body() post: CreatePostDto,
		@Req() req: Request,
		@UploadedFile() image: Express.Multer.File
	) {
		try {
			if (image) {
				post.image = 'uploads/' + image?.filename
			}

			return await this.postService.createPost(post, req['user'])
		} catch (e) {
			throw new BadRequestException(`Ошибка при создании поста: ${e}`)
		}
	}

	@Authorization(UserRole.SUPER_ADMIN, UserRole.TEACHER, UserRole.MODERATOR)
	@ApiBearerAuth('access-token')
	@UseInterceptors(FileInterceptor('image', multerOptions))
	@ApiConsumes('multipart/form-data')
	@Put('/post')
	@ApiOperation({ summary: 'Change post by ID' })
	@ResponseMessage('Пост успешно обновлен!')
	async changePost(
		@Body() post: ChangePostDto,
		@Req() req: Request,
		@UploadedFile() image: Express.Multer.File
	) {
		if (image) {
			post.image = 'uploads/' + image?.filename
		}
		return await this.postService.changePost(post, req['user'])
	}

	@ApiBearerAuth('access-token')
	@ResponseMessage('Пост успешно удален!')
	@Delete('/posts/:id')
	@ApiOperation({ summary: 'Delete post by ID' })
	@ApiParam({ name: 'id', description: 'Post ID' })
	@ApiHeader({ name: 'authorization' })
	async deletePost(@Param('id') id: number) {
		try {
			await this.postService.deletePostById(id)
		} catch (e) {
			throw new BadRequestException(`Ошибка при удалении поста: ${e}`)
		}
	}

	@ApiBearerAuth('access-token')
	@ResponseMessage('Пост отправлен на проверку, ожидайте подтверждения!')
	@Roles(UserRole.TEACHER, UserRole.SUPER_ADMIN)
	@Put('/submit-preview')
	async submitPreviewPost(@Query('postId') postId: number) {
		await this.postService.submitPreviewPost(postId)
	}

	@Get('getPostById')
	async getPostById(@Query('postId') postId: number) {
		return await this.postService.getPostById(postId)
	}

	@Roles(UserRole.MODERATOR)
	@Get('posts-for-moderators')
	async getPostForModerators(@Req() req: Request) {
		return await this.postService.getPostForModerators(req['user'])
	}

	@Post('publish-post')
	async publishPost(@Body() body: PublishPostDto) {
		return await this.postService.publishPost(body)
	}

	@Put('update-post-status')
	async updatePostStatus(@Body() body: UpdatePostStatus) {
		await this.postService.updatePostStatus(body)
	}
}
