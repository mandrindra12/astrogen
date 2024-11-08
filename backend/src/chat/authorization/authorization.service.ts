import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthorizationService {
  private logger = new Logger(AuthorizationService.name);
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  public validateJwt(tokenString: string): boolean {
    try {
      const { user } = this.jwtService.verify(tokenString, {
        secret: this.config.get('ACCESS_TOKEN_KEY'),
      });
      return user ?? true;
    } catch (e) {
      this.logger.error('caught something:', e);
      return false;
    }
  }
}
