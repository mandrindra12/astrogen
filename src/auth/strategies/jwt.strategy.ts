import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { instanceToInstance } from 'class-transformer';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ViktooReqUser } from '../../types/RequestTypes/viktoo-req-user';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_KEY,
      jwtFromRequest: (req: Request) => req?.cookies?.access_token || null, // Get the JWT from cookies
      ignoreExpiration: false,
    });
  }

  async validate(payload: LoginDto): Promise<ViktooReqUser | null> {
    const userInDB = await this.usersService.findOne(payload.email);
    if (!userInDB) {
      return null;
    }

    let reqUser = instanceToInstance(
      new ViktooReqUser({
        userId: userInDB.user_id,
        // followingsNumber: userInDB.followings.length,
        // followersNumber: userInDB.followings.length,
        ...userInDB,
      }),
      {
        excludeExtraneousValues: true,
      },
    );
    return reqUser;
  }
}
