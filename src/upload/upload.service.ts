import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileUpload } from './entity/file-upload.entity';
import { instanceToInstance } from 'class-transformer';
import { FileTypeEnum } from '../enums/file-type-enum';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}

  // Return a valid file type or null
  getFileType(mimetype: string): string | null {
    const fileType: string = mimetype.split('/')[0];
    if (['image', 'video', 'audio'].includes(fileType)) {
      return fileType;
    }
    return null;
  }

  async uploadFiles(
    files: Express.Multer.File[],
    postId?: string,
  ): Promise<boolean> {
    if (files.some((file) => this.getFileType(file.mimetype) === null)) {
      return false;
    }
    for (const file of files) this.uploadFile(file, postId);
    return true;
  }

  // Any file (profil/cover photo or post files)
  async uploadFile(
    file: Express.Multer.File,
    postId?: string,
  ): Promise<string> {
    const uploadSubDir = file.path.split('/').at(-2);
    const uploadname = file.path.split('/').at(-1);
    const fileUrl = `${process.env.BASE_URL}/uploaded_files/${uploadSubDir}/${uploadname}`;
    const fileType =
      (this.getFileType(file.mimetype) as FileTypeEnum) ?? 'image';
    if (postId) {
      const fileUpload: FileUpload = instanceToInstance(
        new FileUpload({
          postId,
          fileUrl,
          fileType,
          ...file,
        }),
        { excludeExtraneousValues: true },
      );

      this.registerFile(fileUpload); // post media file
    }
    /**
     * If there is no postId , this is maybe a profil/cover photo
     * if this is profil/cover photo, we just keep it's url so we can track back
     */
    return fileUrl;
  }

  // Add file in database
  async registerFile(fileUpload: FileUpload) {
    const { postId, ...payload } = fileUpload;
    const mediaCreated = await this.prismaService.medias.create({
      data: {
        media_post: { connect: { post_id: postId } },
        ...payload,
      },
    });
    if (!mediaCreated) console.error('File not uploaded:', fileUpload);
  }
}
