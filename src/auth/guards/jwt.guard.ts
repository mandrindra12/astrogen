import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ViktooRequest } from '../../types/RequestTypes/viktoo-request';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicRoutes = process.env.PUBLIC_ROUTES?.replace(/\s+/g, '').split(
      ',',
    );

    const request: ViktooRequest = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    try {
      const canBeActivated = (await super.canActivate(context)) as boolean;
      if (!canBeActivated && !response.headersSent) {
        request.user = null;
        response.redirect('/');
        return false;
      }
      return true;
    } catch (error) {
      //  throws an unauthorized exception but make it a redirection
      if (error instanceof UnauthorizedException) {
        if (publicRoutes?.includes(request.url)) {
          if (request.user === undefined) {
            request.user = null;
          }
          return true;
        }

        request.user = null;
        if (!response.headersSent) {
          response.redirect('/');
          response.end();
        }
      }
      return false;
    }
  }
}
