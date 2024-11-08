import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), UploadModule],
  providers: [UploadService, UsersService, PrismaService, UploadService],
  controllers: [UsersController],
  exports: [UploadService],
})
export class UsersModule {}
