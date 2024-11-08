import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor() {
    super({
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.access_token || null;
      },
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
