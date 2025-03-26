import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Injectable, UseGuards } from '@nestjs/common'
import { ExamsService } from 'src/exams/exams.service'
import { ComponentTask } from '../component-task/entity/component-task.entity'
import { WsAuthGuard } from './guards/ws.guard'
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
@Injectable()
export class WebsocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server

	constructor(private readonly examService: ExamsService) {}

	afterInit(server: Server): void {
		console.log(`WebSocket сервер запущен ${server}`)
	}

	@UseGuards(WsAuthGuard)
	handleConnection(client: Socket): void {
		console.log(`Клиент подключен: ${JSON.stringify(client.data)}`)
	}

	handleDisconnect(client: Socket): void {
		console.log(`Клиент отключен: ${client.id}`)
	}

	// @SubscribeMessage('startExam')
	// async handleStartExam(
	// 	client: Socket,
	// 	@MessageBody() { userId, examId }: { userId: string; examId: string }
	// ) {
	// 	//const startTime = await this.examService.startExam(userId, examId)
	// 	//client.emit('examStarted', { startTime })
	// }

	// @SubscribeMessage('getExamTime')
	// async handleGetExamTime(client: Socket, @MessageBody() userId: string) {
	// 	// const timeLeft = await this.examService.getTimeLeft(userId)
	// 	// client.emit('examTime', timeLeft)
	// }

	@SubscribeMessage('saveProgress')
	async handleSaveProgress(
		client: Socket,
		@MessageBody()
		{ quiz, answer }: { quiz: ComponentTask; answer: number[] | string }
	) {
		// await this.examService.saveProgress(userId, questionIndex)
		// client.emit('progressSaved', { questionIndex })
	}

	// @SubscribeMessage('checkExamStatus')
	// async handleCheckExamStatus(client: Socket, @MessageBody() userId: string) {
	// 	// const isFinished = await this.examService.isExamFinished(userId)
	// 	// if (isFinished) {
	// 	// 	client.emit('examFinished')
	// 	// }
	// }

	@OnEvent('achievement.completed')
	async handleAchievementCompleted(event: {
		userId: string
		achievementTitle: string
	}) {
		// console.log(
		// 	`Пользователь ${event.userId} получил достижение: ${event.achievementTitle}`
		// )

		// Отправляем уведомление через сокет
		this.server.emit('achievementNotification', {
			title: event.achievementTitle,
			message: `Поздравляем! Вы получили достижение: ${event.achievementTitle}`
		})
	}
}
