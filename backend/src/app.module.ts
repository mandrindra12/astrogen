import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SocketModule } from './socket/socket.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import path from 'node:path';
import { FileStreamsModule } from './file-streams/file-streams.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true, // make it global for every modules
      ttl: 5,
      max: 10, // maximum  number of items
    }),

    // Serving media files
    // ServeStaticModule.forRoot({
    //   rootPath: path.join(
    //     __dirname,
    //     '..',
    //     process.env.UPLOAD_DEST || 'uploads',
    //   ),
    //   serveRoot: 'uploaded_files',
    // }),
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
  ],
  controllers: [],
  providers: [PrismaService, AppGateway],
})
export class AppModule {}
