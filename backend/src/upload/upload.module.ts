import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { MulterConfigService } from '../multer/multer.config';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    PrismaModule,
  ],
  providers: [UploadService, PrismaService],
  controllers: [],
  exports: [
    UploadService,
    MulterModule.registerAsync({ useClass: MulterConfigService })
  ],
})
export class UploadModule {}
