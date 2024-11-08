import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentPostDto } from './dto/comment-post.dto';
import { CommentEntity } from './entities/comment.entity';
import { CommentsSlice } from './entities/comments-slice.entity';

@Injectable()
export class CommentsService {
  constructor(private prismaService: PrismaService) {}

  // slicing data according to payloads
  sliceComments(
    comments: any[],
    currentPage: number,
    perPage: number,
  ): CommentsSlice {
    const nextPage = comments.length > perPage ? currentPage + perPage : null;
    if (nextPage !== null) comments.pop();

    return {
      currentPage: currentPage,
      nextPage: nextPage,
      data: comments.map((cmt) => CommentEntity.parseDbData(cmt)),
    };
  }

  async createComment(payload: CommentPostDto): Promise<{ error: boolean }> {
    const comment = await this.prismaService.comments.create({
      data: {
        body: payload.body,
        commentator: { connect: { user_id: payload.authorId } },
        commented_post: { connect: { post_id: payload.postId } },
        parent_coment: payload.parentCommentId
          ? { connect: { comment_id: payload.parentCommentId } }
          : undefined,
      },
    });
    if (!comment) return { error: true };

    return { error: false };
  }

  /// first level comments (Not sub comments)
  async orderedByDate(
    postId: string,
    currentPage: number,
    perPage: number,
    asc: boolean = true,
  ): Promise<CommentsSlice> {
    const comments = await this.prismaService.comments.findMany({
      skip: currentPage,
      take: perPage,
      where: {
        AND: [{ commented_post_id: postId }, { parent_comment_id: null }],
      },
      orderBy: { created_at: asc ? 'asc' : 'desc' },
      include: { commentator: true, sub_comments: true },
    });

    return this.sliceComments(comments, currentPage, perPage);
  }

  async orderedByPertinence(
    postId: string,
    currentPage: number,
    perPage: number,
    asc: boolean = true,
  ): Promise<CommentsSlice> {
    const comments = await this.prismaService.comments.findMany({
      skip: currentPage,
      take: perPage,
      where: {
        AND: [{ commented_post_id: postId }, { parent_comment_id: null }],
      }, // Not including sub_comments},
      orderBy: { sub_comments: { _count: asc ? 'asc' : 'desc' } },
      include: { commentator: true, sub_comments: true },
    });
    return this.sliceComments(comments, currentPage, perPage);
  }

  async getAll(
    postId: string,
    currentPage: number,
    perPage: number,
    asc: boolean,
  ): Promise<CommentsSlice> {
    const comments = await this.prismaService.comments.findMany({
      skip: currentPage,
      take: perPage + 1,
      where: {
        AND: [{ commented_post_id: postId }, { parent_comment_id: null }], // Not including sub_comments
      },
      include: { commentator: true, sub_comments: true },
    });

    return this.sliceComments(comments, currentPage, perPage);
  }

  /// return sub comments (first level sub comments) (not sub sub comments and etc)
  async getSubComments(
    parentCommentId: string,
    currentPage: number,
    perPage: number,
  ) {
    const comments = await this.prismaService.comments.findMany({
      skip:currentPage,
      take:perPage,
      where: { parent_comment_id: parentCommentId }, //This is not including sub sub comments , ...
      include: { commentator: true, sub_comments: true },
    });
    return this.sliceComments(comments, currentPage, perPage);
  }
}
