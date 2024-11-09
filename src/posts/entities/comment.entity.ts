export class CommentEntity {
  commentId!: string;

  parentCommentId?: string;
  postId!: string;

  body!: string;
  subCommentsNumber!: number;
  createdAt!: Date;

  commentator!: {
    username: string;
    avatar: string;
  };

  files?: string;

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
        avatar: data.commentator.avatar,
        username: data.commentator.name,
      },

      likers: data.comment_likers,
    };
  }
}
