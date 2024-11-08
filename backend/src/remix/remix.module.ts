import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth/auth.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/notification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RemixController } from './remix.controller';
import { RemixService } from './remix.service';

@Module({
  imports: [NotificationModule, AuthModule, ConfigModule.forRoot(), PrismaModule],
  controllers: [AuthController, RemixController],
  providers: [NotificationService, JwtService, RemixService],
})
export class RemixModule {}
