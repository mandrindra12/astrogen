import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getPublicDir, startDevServer } from '@viktoo/frontend';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';

const logger = new Logger('Main.ts');

const selectedPort = process.env.PORT ?? 3000;
const selectedIP = process.env.IP ?? 'localhost';

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
const redisclient = new Redis(redisURL, {});
const redisStore = new RedisStore({
  client: redisclient,
  ttl: 86400 * 20, // 20 days
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });
  app.set('trut proxy', 'loop back');
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'secret123',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400 * 20,
        sameSite: 'lax',
        secure: false,
        httpOnly: true,
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  app.useStaticAssets(getPublicDir(), {
    immutable: true,
    maxAge: '1y',
    index: false,
  });

  // Listen after setting up the app.
  await startDevServer(app);
  await app.listen(selectedPort, selectedIP);

  logger.log(`The server is running on http://${selectedIP}:${selectedPort}`);
}

bootstrap();
