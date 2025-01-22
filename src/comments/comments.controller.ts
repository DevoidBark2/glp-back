import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { ApiTags } from '@nestjs/swagger'
import { Authorization } from '../auth/decorators/auth.decorator'
import { CreateCommentDto } from './dto/create-comment.dto'
import { ResponseMessage } from '../decorators/response-message.decorator'

@ApiTags('Комментарии')
@Controller('')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Authorization()
	@Get('comments/:sectionId')
	async getComment(@Param('sectionId') sectionId: number) {
		return await this.commentsService.getSectionComments(sectionId)
	}

	@Authorization()
	@Post('comments')
	@ResponseMessage('Комментарий успешно добавлен!')
	async sendComment(@Body() body: CreateCommentDto, @Req() req: Request) {
		return await this.commentsService.sendSectionComment(body, req['user'])
	}

	@Authorization()
	@Delete('comments/:commentId')
	@ResponseMessage('Комментарий успешно удален!')
	async deleteSectionComment(@Param('commentId') commentId: string) {
		return await this.commentsService.deleteComment(commentId)
	}
}
