import { Module } from '@nestjs/common';
import { FileStreamsController } from './file-streams.controller';

@Module({
  imports: [],
  controllers: [FileStreamsController],
  exports: [],
})
export class FileStreamsModule {}
