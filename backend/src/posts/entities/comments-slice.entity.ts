import { CommentEntity } from './comment.entity';

export type CommentsSlice = {
  currentPage: number;
  nextPage: number | null;
  data: CommentEntity[];
};
