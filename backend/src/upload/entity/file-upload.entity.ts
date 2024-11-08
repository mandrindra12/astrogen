import { Expose } from 'class-transformer';
import { FileTypeEnum } from '../../enums/file-type-enum';

export class FileUpload {
  @Expose() postId?: string;
  @Expose() fileUrl!: string;
  @Expose() fileType!: FileTypeEnum;
  @Expose() filename!: string;
  @Expose() encoding!: string;
  @Expose() mimetype!: string;
  @Expose() path!: string;
  @Expose() size!: number;

  constructor(init?: Partial<FileUpload>) {
    Object.assign(this, init);
  }
}

