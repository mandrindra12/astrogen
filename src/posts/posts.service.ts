import {
  HttpException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
import { ReelsSlice } from './entities/reels-slice.entity';
import { SavedReelCard } from './entities/saved-reel-card.entity';
import { SavedReelsSlice } from './entities/saved-reels-slice.entity';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  // Making slice login here to avoid code duplication
  slicePosts(
    postsFound: any,
    startPage: number,
    perPage: number,
    saved: boolean = false,
  ): ReelsSlice | SavedReelsSlice {
    const nextPage = postsFound.length > perPage ? startPage + perPage : null;
    if (nextPage !== null) postsFound.pop();

    return {
      currentPage: startPage,
      nextPage: nextPage,
      data: postsFound.map((post: any) =>
        (saved ? SavedReelCard : PostEntity).parseDbData(post),
      ),
    };
  }

  // CREATE
  async create(
    payload: CreatePostDto,
    email?: string,
    uploads?: Express.Multer.File[],
  ): Promise<boolean> {
    try {
      if (!email) {
        throw new UnauthorizedException('Please log in before posting');
      }
      let categoryId: string | null = null;

      // add new category in database if there is a category in payload
      if (payload.category) {
        categoryId = (
          await this.prismaService.post_categories.create({
            data: { category_value: payload.category },
          })
        ).category_id;
      }

      const post = await this.prismaService.posts.create({
        data: {
          // assign category if there is a category in the payload
          post_category: categoryId
            ? { connect: { category_id: categoryId } }
            : undefined,

          author: { connect: { email: email } },
          title: payload.title,
          price: payload.price ? parseInt(payload.price) : undefined,
          description: payload.body,
        },
      });
      if (!uploads) return true; // No file to upload

      const uploaded: boolean = await this.uploadService.uploadFiles(
        uploads,
        post.post_id,
      );
      return uploaded;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to create post', 404);
    }
  }

  // Infinite Scroll slice
  async getAllReelsSlice(
    startPage: number,
    perPage: number,
    userId?: string,
  ): Promise<ReelsSlice | SavedReelsSlice> {
    const postsFound = await this.prismaService.posts.findMany({
      skip: startPage,
      take: perPage + 1,
      include: {
        medias: true,
        author: true,
        comments: true,
        post_category: true,
      },
    });
    return this.slicePosts(postsFound, startPage, perPage);
  }

  async findPostByDescriptionSlice(
    targetDesc: string,
    startPage: number,
    perPage: number,
  ): Promise<ReelsSlice | SavedReelsSlice> {
    const postsFound = await this.prismaService.posts.findMany({
      skip: startPage,
      take: perPage + 1,
      where: { description: { contains: targetDesc } },
      include: {
        medias: true,
        author: true,
        post_category: true,
        comments: true,
      },
    });
    return this.slicePosts(postsFound, startPage, perPage);
  }

  async findPostByTitleSlice(
    targetTitle: string,
    startPage: number,
    perPage: number,
  ): Promise<ReelsSlice | SavedReelsSlice> {
    const postsFound = await this.prismaService.posts.findMany({
      skip: startPage,
      take: perPage + 1,
      where: { title: { contains: targetTitle } },
      include: {
        medias: true,
        author: true,
        post_category: true,
        comments: true,
      },
    });

    return this.slicePosts(postsFound, startPage, perPage);
  }

  async findPostByAuthorIdSlice(
    userId: string,
    startPage: number,
    perPage: number,
  ): Promise<ReelsSlice | SavedReelsSlice> {
    const postsFound = await this.prismaService.posts.findMany({
      skip: startPage,
      take: perPage + 1,
      where: { author_id: userId },
      include: {
        medias: true,
        author: true,
        post_category: true,
        comments: true,
      },
    });

    return this.slicePosts(postsFound, startPage, perPage);
  }

  // ABOUT SAVING POSTS
  async savePost(postId: string, userId?: string): Promise<boolean | null> {
    if (!userId) return false;

    const post = await this.prismaService.posts.findUnique({
      where: { post_id: postId },
    });
    if (!post) return false;

    // checking if the post was already saved
    const alreadySaved = await this.prismaService.users_saved_posts.findFirst({
      where: { saved_post_id: postId },
    });
    if (alreadySaved) return null;

    // Saving the post for the request user
    const saved = await this.prismaService.users_saved_posts.create({
      data: {
        saved_post: { connect: { post_id: postId } },
        user_saving: { connect: { user_id: userId } },
      },
    });

    return saved ? true : false;
  }

  async deleteSavedPost(postId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;

    // check if the post is really saved
    const postSaved = await this.prismaService.users_saved_posts.findFirst({
      where: { saved_post_id: postId },
    });
    if (!postSaved) return false;

    const deleted = await this.prismaService.users_saved_posts.deleteMany({
      where: { saved_post_id: postId },
    });

    return deleted ? true : false;
  }

  async getSavedPost(
    startPage: number,
    perPage: number,
    userId: string,
  ): Promise<SavedReelsSlice | ReelsSlice> {
    const postsFound = await this.prismaService.users_saved_posts.findMany({
      skip: startPage,
      take: perPage + 1,
      where: { user_saving_id: userId },
      include: {
        saved_post: {
          include: {
            author: true,
            comments: true,
            medias: true,
            post_category: true,
          },
        },
      },
    });

    return this.slicePosts(postsFound, startPage, perPage, true);
  }
}
