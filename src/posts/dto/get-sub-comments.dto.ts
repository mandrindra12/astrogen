import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class GetSubCommentsDto {
  @IsUUID() parentCommentId!: string;
  @IsNumber() currentPage!: number;
  @IsNumber() @IsPositive() perPage!: number;
}
