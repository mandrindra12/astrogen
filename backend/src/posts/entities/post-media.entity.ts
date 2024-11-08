import { Expose } from 'class-transformer';

export class PostMedia {
  @Expose() encoding!: string;
  @Expose() mimetype!: string;

  @Expose() filename!: string;
  @Expose() path!: string;
  @Expose() size!: number;

  @Expose() fileType!: string;

  constructor(init?: Partial<PostMedia>) {
    Object.assign(this, init);
  }
}
