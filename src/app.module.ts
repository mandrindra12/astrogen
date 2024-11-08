import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FileStreamsModule } from './file-streams/file-streams.module';
import { FlashcardModule } from './flashcard/flashcard.module';
import { NotificationModule } from './notification/notification.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { QuizModule } from './quiz/quiz.module';
import { SocketModule } from './socket/socket.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true, // make it global for every modules
      ttl: 5,
      max: 10, // maximum  number of items
    }),
    NotificationModule,
    JwtModule,
    SocketModule,
    ChatModule,
    UsersModule,
    PrismaModule,
    AuthModule,
    UploadModule,
    PostsModule,
    FileStreamsModule,
    QuizModule,
    FlashcardModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppGateway],
})
export class AppModule {}
