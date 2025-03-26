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

		const result = await this.componentTaskService.submitExamUser(
			examId,
			courseId,
			userId
		)

		// console.log(
		// 	`Экзамен: ${result.id} Результат: X правильных, X неправильных`
		// )
	}
}
