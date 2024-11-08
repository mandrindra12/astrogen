import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UploadModule } from '../upload/upload.module';
import { UploadService } from '../upload/upload.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments.service';

@Module({
  imports: [PrismaModule, UsersModule, UploadModule],
  controllers: [PostsController],
  providers: [
    UsersService,
    PostsService,
    CommentsService,
    PrismaService,
    UploadService,
  ],
})
export class PostsModule {}
