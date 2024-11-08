import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification/notification.service';
import { SocketService } from './socket/socket.service';
import { CreateNotificationDto } from './types/CreateNotification.dto';

type TypeSenderNotif = {
  recipientId: string;
  senderId: string | null;
  content: string;
};

@WebSocketGateway(3001, {
  cors: '*',
})
export class AppGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer() private readonly server!: Server;
  private logger = new Logger(AppGateway.name);
  private userSocketMap = new Map<string, string>();
  constructor(private readonly socketService: SocketService, private readonly notificationService: NotificationService) {}

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(client.id);
    this.server.emit('confirmation', client.id);
    this.logger.log(`This client is connected ${client.id}`);
    const userId = client.handshake.query.userId as string;
    this.userSocketMap.set(userId, client.id);
    console.log('Connection:', this.userSocketMap);
  }

  // when a user log out this function is called (OnGatewayDisconnect)
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // convert the map into an array
    const afm = Array.from(this.userSocketMap.entries());
    const userId = afm.find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) {
      try {
        // await this.chatService.changeStatus(userId, null, 'log_out');
        this.userSocketMap.delete(userId);
        this.logger.log(`This client is disconnect ${userId}`);
      } catch (e) {
        this.logger.error(e);
        return;
      }
    }
    return;
  }

  @SubscribeMessage('notifications')
  async handleNotification(
    @MessageBody() notification: CreateNotificationDto,
  ) {
    await this.notificationService.newNotification(notification);
  }

  @SubscribeMessage('join-room')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    client.join(roomId);
    this.logger.debug("I joined this room", roomId);
  }
}
