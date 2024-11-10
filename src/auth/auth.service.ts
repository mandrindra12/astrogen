import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateRandomPassword(): Promise<string> {
    const charset: string =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let password: string = '';
    for (let i: number = 0; i < charset.length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return await this.cryptPassword(password);
  }

  async cryptPassword(password: string): Promise<string> {
    const salt = 6;
    const hashedPass = bcrypt.hash(password, salt);
    return await hashedPass;
  }

  async handleJWT(
    credentials: {
      email: string;
      name?: string;
      password: string;
      id?: string;
    },
    res: Response,
  ): Promise<any> {
    const accessToken: string = this.jwtService.sign(credentials, {
      secret: process.env.JWT_KEY,
    });
    const refreshToken: string = this.jwtService.sign(credentials, {
      secret: process.env.JWT_REFRESH_KEY,
    });
    res.cookie('name', credentials.name, {httpOnly: true })
    res.cookie('id', credentials.id, { httpOnly: true });
    res.cookie('access_token', accessToken, { httpOnly: true});
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return {login: accessToken, refresh: refreshToken};
  }

  async refreshJWT(token: string): Promise<string> {
    try {
      const { exp, ...credentials } = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      const newToken = this.jwtService.sign(credentials, {
        secret: process.env.JWT_KEY,
      });
      return newToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async generateOtpJwt(email: string, otp: string): Promise<string> {
    const otpJwt = this.jwtService.sign(
      { email, otp },
      {
        secret: process.env.OTP_KEY,
      },
    );
    return otpJwt;
  }

  // Validate verification code
  async validateOtp(payload: { otp: string }, req: Request): Promise<boolean> {
    try {
      const credentials = await this.jwtService.verify(req.cookies.otp_token, {
        secret: process.env.OTP_KEY,
      });
      if (credentials.otp !== payload.otp) return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Register new user
  async validateSignup(payload: SignUpDto): Promise<UserEntity | null> {
    const userFind: UserEntity | null = await this.usersService.findOne(
      payload.email,
    );

    // Valid if user.email is not undefined
    // Note: all fields are undefined if user does not exists
    if (userFind?.email) return null;
    const user: UserEntity = await this.usersService.create(payload);
    return user;
  }

  // Simple login without google
  async validateLogin(payload: LoginDto): Promise<AuthEntity | null> {
    const userFound: UserEntity | null = await this.usersService.findOne(
      payload.email,
    );
    if (!userFound?.email) return null;

    let authEntity = instanceToInstance(new AuthEntity(userFound), {
      excludeExtraneousValues: true,
    });

    const correctPassword = await bcrypt.compare(
      payload.password,
      authEntity.password,
    );
    if (!correctPassword) {
      authEntity.error = true;
      authEntity.errorMessage = 'Invalid password';
    }

    return authEntity;
  }

  // Validate the google authentication after verifying the verification code
  async validateGoogleLogin(
    payload: GoogleLoginDto,
  ): Promise<UserEntity | null> {
    payload.name = payload.email.split('@')[0];
    if (!payload.password) {
      payload.password = await this.generateRandomPassword();
    }

    let user: UserEntity | null = await this.usersService.findOne(
      payload.email,
    );

    if (!user) {
      user = await this.usersService.create({
        name: payload.name,
        password: payload.password,
        email: payload.email,
      });
    }

    return user;
  }
}
