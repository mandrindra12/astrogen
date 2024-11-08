import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { InvalidFileTypeError } from '../errors/invalid-file-type.error';

@Catch(InvalidFileTypeError)
export class FileTypeFilter implements ExceptionFilter {
  catch(exception: InvalidFileTypeError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        exception.message === 'UNEXPECTED_FILE_TYPE'
          ? 'Invalid file type. Only images, videos, and audio files are allowed.'
          : exception.message,
      error: 'Bad Request',
      filename: exception.filename,
    });
  }
}
