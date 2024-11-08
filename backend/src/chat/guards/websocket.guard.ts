import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class WebSocketGuard implements CanActivate {
  logger = new Logger(WebSocketGuard.name);
  constructor(private auth: AuthorizationService) {}
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const client = ctx.switchToWs().getClient();
      const { authorization } = client.handshake.headers;
      const tokenString = authorization.split(' ')[1];
      if (!this.auth.validateJwt(tokenString))
        throw new WsException('Unauthorized');
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }
}
