import { PostEntity } from './post.entity';

export class SavedReelCard {
  savedAt!: Date;
  data!: PostEntity;

  static parseDbData(post: any): SavedReelCard {
    return {
      savedAt: post.saved_at,
      data: PostEntity.parseDbData(post.saved_post),
    };
  }
}
