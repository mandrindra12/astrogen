import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class RemixService {
  constructor(public readonly notification: NotificationService) {}

  public readonly getHello = (): string => {
    return 'hello from remix service';
  };

  public readonly getAllNotifications = async (username: string) => {
    return await this.notification.getAllNotifications(username);
  };
}
