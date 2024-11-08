import { Injectable } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Injectable()
export class SavePostDto {
  @Expose() @IsUUID() postId!: string;
}
