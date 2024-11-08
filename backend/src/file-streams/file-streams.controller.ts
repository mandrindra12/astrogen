import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('uploaded_files')
export class FileStreamsController {
  @Get(':sub_dir/:file_name')
  getFile(
    @Param('sub_dir') sub_dir: string,
    @Param('file_name') file_name: string,
    @Res() res: Response,
  ) {
    const file = createReadStream(
      join(
        process.cwd(),
        `../${process.env.UPLOAD_DEST}/${sub_dir}/${file_name}`,
      ),
    );

    res.sendFile(file.path as string);
  }
}
