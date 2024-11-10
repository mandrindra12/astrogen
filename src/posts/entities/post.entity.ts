
export class PostEntity {
  postId!: string;
  timestamp!: Date;

  author!: {
    authorName: string;
    authorId: string;
    avatar: string | null;
  };

  body!: string;

  files?: string[];

  commentsNumber?: number;

  likes?: string[];
  supporters?: string[];

  constructor(init?: Partial<PostEntity>) {
    Object.assign(this, init);
  }

  static parseDbData(dbData: any) {
    return new PostEntity({
      postId: dbData.post_id,
      timestamp: dbData.created_at,
      author: {
        authorId: dbData.author_id,
        authorName: dbData.author.name,
        avatar: dbData.author.avatar,
      },
      body: dbData.description,
      files: dbData.medias.map((media: any) => (
        media.fileUrl
        // encoding: media.encoding,
        // mimetype: media.mimetype,
        // mediaUrl: media.fileUrl,
        // fileType: media.fileType,
        // size: Number(media.size), // Convert bigint to number
      )),
      supporters: dbData.supporters,
      likes: dbData.post_likers,
      commentsNumber: dbData.comments?.length ? dbData.comments.length : 0,
    });
  }
}
