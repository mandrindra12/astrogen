import { PostEntity } from './post.entity';

export type ReelsSlice = {
  currentPage: number;
  nextPage: number | null;
  data: PostEntity[];
};
