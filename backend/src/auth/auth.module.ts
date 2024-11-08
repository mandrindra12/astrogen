import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { OtpStrategy } from './strategies/otp.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    PrismaModule,
    UsersModule,

    // For authentication
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '2h' },
      verifyOptions: { ignoreExpiration: false },
    }),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_KEY,
      signOptions: { expiresIn: '1d' },
      verifyOptions: { ignoreExpiration: false },
    }),

    // For mail verification code
    JwtModule.register({
      secret: process.env.OTP_KEY,
      signOptions: { expiresIn: '10m' },
      verifyOptions: { ignoreExpiration: false },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    UsersService,
    EmailService,
    OtpStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, EmailService, UsersService],
})
export class AuthModule {}
