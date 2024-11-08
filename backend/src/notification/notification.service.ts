import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { CreateNotificationDto } from '../types/CreateNotification.dto';

type TypeSenderNotif = {
  recipientId: string;
  senderId: string | null;
  content: string;
};

const allNotifs: TypeSenderNotif[] = [
  {
    recipientId: 'u8NErq-9RGvR_1bEAAAC',
    senderId: 'bt4gMWXyOgBBqya4AAAD',
    content: 'This is the first notification',
  },
];

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}
  private logger = new Logger(NotificationService.name);

  // return all notifications received by a user
  async getAllNotifications(username: string) {
    const notifs = await this.prisma.nofitications.findMany({
      where: {
        receiver_name: username,
      },
    });
    return notifs;
  }
  // register notification in a database received by a user
  async newNotification(notification: CreateNotificationDto) {
    try {
      const [senderExist, recipientExist] = await Promise.all([
        this.prisma.users.findUnique({
          where: {
            user_id: notification.senderId!,
          },
          select: {
            name: true,
          },
        }),
        this.prisma.users.findUnique({
          where: {
            user_id: notification.recipientId,
          },
          select: {
            name: true,
          },
        }),
      ]);
      if (senderExist && recipientExist) {
        await this.prisma.nofitications.create({
          data: {
            content: notification.content,
            receiver_name: recipientExist.name!,
            sender_name: senderExist.name!,
          },
        });
      } else throw new Error('Make sure both user exists!');
      this.socketService.server
        .to(notification.recipientId)
        .emit('new-notification', notification);
      return {
        error: false,
        notification,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        error: true,
        e,
      };
    }
  }
}
