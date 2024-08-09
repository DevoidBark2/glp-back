// websocket.gateway.ts

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server): any {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket): any {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() messageBody: string) {
    console.log('Message', messageBody);
    this.server.emit('message', `Echo: ${messageBody}`);
  }

  @SubscribeMessage('adminMessage')
  handleAdminMessage(@MessageBody() messageBody: string) {
    console.log('Admin message', messageBody);
    // Broadcast message to all clients
    this.server.emit('adminMessage', messageBody);
  }
}
