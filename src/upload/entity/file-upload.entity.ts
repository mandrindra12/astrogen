import { file_type_enum } from '@prisma/client';
import { Expose } from 'class-transformer';

export class FileUpload {
  @Expose() postId?: string;
  @Expose() fileUrl!: string;
  @Expose() fileType!: file_type_enum;
  @Expose() filename!: string;
  @Expose() encoding!: string;
  @Expose() mimetype!: string;
  @Expose() path!: string;
  @Expose() size!: number;

  constructor(init?: Partial<FileUpload>) {
    Object.assign(this, init);
  }
}

