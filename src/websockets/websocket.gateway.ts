import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ExamsService } from 'src/exams/exams.service';

@WebSocketGateway({ cors: true })
@Injectable()
export class WebsocketGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(private readonly examService: ExamsService) { }

	afterInit(server: Server): void {
		console.log('WebSocket сервер запущен');
	}

	handleConnection(client: Socket): void {
		console.log(`Клиент подключен: ${client.id}`);
	}

	handleDisconnect(client: Socket): void {
		console.log(`Клиент отключен: ${client.id}`);
	}

	// Получение оставшегося времени экзамена
	@SubscribeMessage('getExamTime')
	async handleGetExamTime(client: Socket, @MessageBody() userId: string) {
		// const timeLeft = await this.examService.getTimeLeft(userId);
		// client.emit('examTime', timeLeft);
	}

	// Сохранение текущего вопроса
	@SubscribeMessage('saveProgress')
	async handleSaveProgress(client: Socket, @MessageBody() data: { userId: string; questionIndex: number }) {
		//	await this.examService.saveProgress(data.userId, data.questionIndex);
	}

	// Проверка завершения экзамена
	@SubscribeMessage('checkExamStatus')
	async handleCheckExamStatus(client: Socket, @MessageBody() userId: string) {
		// const isFinished = await this.examService.isExamFinished(userId);
		// if (isFinished) {
		// 	client.emit('examFinished');
		// }
	}
}
