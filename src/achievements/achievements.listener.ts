import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { AchievementsService } from './achievements.service'
import { CommentAddedEvent } from './events/achievement.events'
import { ConditionTypeEnum } from './enums/condition_type.enum'

@Injectable()
export class AchievementsListener {
	constructor(private readonly achievementsService: AchievementsService) {}

	@OnEvent('comment.added')
	async handleCommentAdded(event: CommentAddedEvent) {
		await this.achievementsService.updateAchievementProgress(
			event.userId,
			ConditionTypeEnum.GIVE_FEEDBACK,
			1
		)
	}

	@OnEvent('course.completed')
	async handleCourseCompleted(event: { userId: string }) {
		await this.achievementsService.updateAchievementProgress(
			event.userId,
			ConditionTypeEnum.COMPLETE_COURSES,
			1
		)
	}

	@OnEvent('quiz.completed')
	async handleQuizCompleted(event: { userId: string; score: number }) {
		if (event.score === 100) {
			await this.achievementsService.updateAchievementProgress(
				event.userId,
				ConditionTypeEnum.COMPLETE_ASSESSMENT,
				1
			)
		}
	}
}
