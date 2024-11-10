import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { EmailService } from '../email/email.service';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthEntity } from './entities/auth.entity';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async singUp(@Body() payload: SignUpDto, @Res() res: Response) {
    const user: UserEntity | null =
      await this.authService.validateSignup(payload);
    if (!user) throw new HttpException('User already exists', 409);
    const credentials = {...payload, id: user.user_id};
    const token = await this.authService.handleJWT(credentials, res);
    res.send({
      id: user.user_id,
      name: user.name,
      ...token,
      error: false
    });
  }

  @Post('login')
  async logIn(@Body() payload: LoginDto, @Res() res: Response) {
    const user: AuthEntity | null =
      await this.authService.validateLogin(payload);

    if (!user) throw new HttpException('User does not exist', 404);
    if (user.error) {
      res.send({
        error: true,
        message: user.errorMessage,
      });
      return;
    }
    const credentials = { ...user, id: user.user_id, name: user.name.replaceAll(' ', '-') };
    const token = await this.authService.handleJWT(credentials, res);
    res.send({error: false, message: "", id: user.user_id, name: user.name, ...token });
  }

  @Get('logout')
  async logOut(@Res() response: Response) {
    response.clearCookie('connect.sid');
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    response.clearCookie('id');
    response.clearCookie('name');
    response.send({
      message: 'disconnected',
    });
  }

  @Post('google-login')
  async googleLogIn(
    @Body() payload: GoogleLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const otp: string = '123456'; //await this.emailService.generateOTP();
    this.emailService.sendOtpEmail(payload.email, otp);
    const otpJwt: string = await this.authService.generateOtpJwt(
      payload.email,
      otp,
    );
    res.cookie('otp_token', otpJwt, { httpOnly: true });
    res.cookie('google_credentials', JSON.stringify(payload), {
      httpOnly: true,
    });
    res.send();
  }

  @Post('verify-google-otp')
  async verifyGoogleOtp(
    @Body() payload: { otp: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const verified = await this.authService.validateOtp(payload, req);
    if (!verified) throw new HttpException('Invalid verification code', 401);
    const credentials: GoogleLoginDto = JSON.parse(
      req.cookies.google_credentials,
    );
    res.cookie('google_credentials', undefined, { httpOnly: true });
    this.authService.validateGoogleLogin(credentials);
  }

  @Post('forgot_password')
  async redirectResetLink() {}

  @UseGuards(JwtGuard)
  @Get('guarded')
  async guardedRoute() {
    return { message: 'this is a guarded route' };
  }

  @UseGuards(JwtGuard)
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const newJWT: string = await this.authService.refreshJWT(
      req.cookies.refresh_token,
    );
    res.cookie('access_token', newJWT, { httpOnly: true });
    res.send(this.jwtService.verify(newJWT, { secret: process.env.JWT_KEY }));
  }
}
