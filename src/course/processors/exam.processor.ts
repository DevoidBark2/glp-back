import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ComponentTaskService } from '../../component-task/component-task.service'

@Processor('examQueue')
export class ExamProcessor {
	constructor(private readonly componentTaskService: ComponentTaskService) {}

	@Process('checkExam')
	async handleExamCheck(
		job: Job<{ userId: string; examId: number; courseId: number }>
	) {
		const { userId, examId, courseId } = job.data
		console.log(`Проверяем экзамен пользователя ${userId}`)

		const result = await this.componentTaskService.submitExamUser(
			examId,
			courseId,
			userId
		)

		console.log(
			`Экзамен: ${examId} Результат: X правильных, X неправильных`
		)
	}
}
