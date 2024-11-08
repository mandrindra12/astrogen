export class CommentEntity {
  commentId!: string;

  parentCommentId?: string;
  postId!: string;

  body!: string;
  subCommentsNumber!: number;
  createdAt!: Date;

  commentator!: {
    userId: string;
    username: string;
    photoUrl: string;
  };

  likers!: string[];

  constructor(init?: Partial<CommentEntity>) {
    Object.assign(this, init);
  }

  static parseDbData(data: any) {
    return {
      commentId: data.comment_id,

      parentCommentId: data.parent_comment_id,
      postId: data.commented_post_id,

      body: data.body,
      subCommentsNumber: data.sub_comments ? data.sub_comments.length : 0,
      createdAt: data.created_at,

      commentator: {
        userId: data.commentator.user_id,
        username: data.commentator.name,
        photoUrl: data.commentator.profile_photo_url,
      },

      likers: data.comment_likers,
    };
  }
}
