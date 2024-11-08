import { instanceToInstance } from 'class-transformer';
import { PostMedia } from './post-media.entity';

export class PostEntity {
  postId!: string;
  createdAt!: Date;

  user!: {
    userId: string;
    username: string;
    photoUrl: string | null;
  };

  title!: string;
  description!: string;

  medias?: PostMedia[];
  price?: number;

  commentsNumber?: number;

  likers?: string[];
  category?: string;

  constructor(init?: Partial<PostEntity>) {
    Object.assign(this, init);
  }

  static parseDbData(dbData: any) {
    return new PostEntity({
      postId: dbData.post_id,
      createdAt: dbData.created_at,
      user: {
        userId: dbData.author_id,
        username: dbData.author.name,
        photoUrl: dbData.author.profile_photo_url,
      },
      title: dbData.title,
      description: dbData.description,
      medias: dbData.medias.map((media: any) => ({
        encoding: media.encoding,
        mimetype: media.mimetype,
        mediaUrl: media.fileUrl,
        fileType: media.fileType,
        size: Number(media.size), // Convert bigint to number
      })),
      likers: dbData.post_likers,
      category: dbData.post_category?.category_value ?? null,
      commentsNumber: dbData.comments?.length ? dbData.comments.length : 0,
      price: Number(dbData.price),
    });
  }
}
