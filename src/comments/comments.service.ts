import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Comments } from './entity/comments.entity'
import { User } from '../user/entity/user.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { SectionEntity } from '../section/entity/section.entity'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Comments)
		private readonly commentsRepository: Repository<Comments>,
		@InjectRepository(SectionEntity)
		private readonly sectionEntityRepository: Repository<SectionEntity>
	) {}

	async getSectionComments(sectionId: number) {
		return await this.commentsRepository.find({
			where: {
				section: { id: sectionId }
			},
			relations: {
				user: true
			},
			select: {
				user: {
					id: true,
					first_name: true,
					last_name: true,
					second_name: true,
					profile_url: true,
					method_auth: true
				}
			},
			order: {
				createdAt: 'DESC'
			}
		})
	}

	async sendSectionComment(body: CreateCommentDto, user: User) {
		const section = await this.sectionEntityRepository.findOneBy({
			id: body.sectionId
		})
		const newComment = await this.commentsRepository.save({
			id: uuidv4(),
			text: body.comment,
			section: section,
			user: user
		})

		return {
			id: newComment.id,
			text: newComment.text,
			user: {
				id: newComment.user.id,
				first_name: newComment.user.first_name,
				last_name: newComment.user.last_name,
				second_name: newComment.user.second_name,
				profile_url: newComment.user.profile_url,
				method_auth: newComment.user.method_auth
			}
		}
	}

	async deleteComment(commentId: string) {
		await this.commentsRepository.delete(commentId)
	}
}
