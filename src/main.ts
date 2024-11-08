import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import { AppModule } from './app.module';

const logger = new Logger('Main.ts');

const selectedPort = process.env.PORT ?? 80;
const selectedIP = process.env.IP ?? 'localhost';

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisclient = new Redis(redisURL, {});
// const redisStore = new RedisStore({
//   client: redisclient,
//   ttl: 86400 * 20, // 20 days
// });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });
  // app.set('trust proxy', 'loop back');
  // app.use(
  //   session({
  //     store: redisStore,
  //     secret: process.env.SESSION_SECRET || 'secret123',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: 86400 * 20,
  //       sameSite: 'lax',
  //       secure: false,
  //       httpOnly: true,
  //     },
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());


  // Listen after setting up the app.
  await app.listen(selectedPort);

  logger.log(`The server is running on http://${selectedIP}:${selectedPort}`);
}

bootstrap();
