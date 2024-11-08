import { Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ViktooRequest } from '../types/RequestTypes/viktoo-request';
import { InvalidFileTypeError } from './errors/invalid-file-type.error';

// Create subdirectory from user email
function hashDirectoryName(orgName: string) {
  const hash = crypto.createHash('sha256').update(orgName).digest('hex');
  return hash;
}

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req: ViktooRequest, file, cb) => {
          if (!req.user?.email) {
            return;
          }

          const subdirectory = hashDirectoryName(req.user.email);
          const uploadPath = path.join(
            __dirname,
            `../../../${process.env.UPLOAD_DEST}`,
            subdirectory,
          );

          // Create the directory if it doesn't exist
          if (!fs.existsSync(uploadPath) && req.user) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, fileExtName);
          cb(null, `${baseName}-${uniqueSuffix}${fileExtName}`);
        },
      }),

      limits: { fileSize: 200 * 1024 * 1024 }, // 10 MB in bytes

      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/', 'video/', 'audio/'];

        if (allowedMimeTypes.some((type) => file.mimetype.startsWith(type))) {
          cb(null, true);
        } else {
          const error = new InvalidFileTypeError('UNEXPECTED_FILE_TYPE');
          error.filename = file.originalname;
          cb(error, false); // do not upload invalid file
        }
      },
    };
  }
}
