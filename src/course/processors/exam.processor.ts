import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { ExamsService } from 'src/exams/exams.service'

@Processor('examQueue')
export class ExamProcessor {
	constructor(private readonly examService: ExamsService) {}

	@Process('checkExam')
	async handleExamCheck(job: Job<{ userId: string; examId: string }>) {
		const { userId, examId } = job.data
		console.log(`Проверяем экзамен пользователя ${userId}`)

		// const result = await this.examService(userId, examId);

		console.log(
			`Экзамен: ${examId} Результат: X правильных, X неправильных`
		)
	}
}
