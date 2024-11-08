import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CommentPostDto {
  @IsUUID()
  authorId!: string;

  @IsUUID()
  postId!: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;

  @IsNotEmpty()
  body!: string;
}
