import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileTypeFilter } from '../multer/filters/file-type.filter';
import { ViktooRequest } from '../types/RequestTypes/viktoo-request';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments.service';
import { CommentPostDto } from './dto/comment-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { GetComsDto } from './dto/get-coms.dto';
import { GetPostsScliceDto } from './dto/get-posts-slice.dto';
import { GetSubCommentsDto } from './dto/get-sub-comments.dto';
import { SavePostDto } from './dto/save-post.dto';
import { CommentsSlice } from './entities/comments-slice.entity';
import { PostEntity } from './entities/post.entity';
import { ReelsSlice } from './entities/reels-slice.entity';
import { SavedReelsSlice } from './entities/saved-reels-slice.entity';
import { PostsService } from './posts.service';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post('create')
  @UseFilters(FileTypeFilter)
  @UseInterceptors(FilesInterceptor('files', 5))
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() request: ViktooRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const created = await this.postsService.create(
      createPostDto,
      request.user?.email,
      files,
    );
    if (!created) throw new HttpException('Failed to upload file', 400);
    return { message: 'Post created successfully!' };
  }

  @Post('get_posts')
  async getPostsScroll(
    @Body() payload: GetPostsScliceDto,
    @Req() request: ViktooRequest,
  ): Promise<ReelsSlice | SavedReelsSlice> {
    if (!request.user?.userId) {
      throw new UnauthorizedException('Please log in before getting posts');
    }

    // Get saved posts or just all posts
    const functionToCall = payload.saved
      ? this.postsService.getSavedPost.bind(this.postsService)
      : this.postsService.getAllReelsSlice.bind(this.postsService);

    const reels = await functionToCall(
      payload.startPage,
      payload.perPage,
      request.user.userId,
    );

    if (!reels) throw new HttpException('Unable to find posts', 404);
    return reels;
  }

  @Get('user_posts/:userId')
  async getUserPost(@Param('userId', ParseUUIDPipe) userId: string) {
    console.log("get /posts/user_posts/")
    const dbData = await this.postsService.findByUserId(userId);
    const userPosts = PostEntity.parseDbData(dbData);
    return userPosts;
  }

  //find by title
  @Post('find_title')
  async findTitle(@Body() payload: GetPostsScliceDto) {
    if (!payload.title) {
      throw new BadRequestException('Please provide the wanted post title');
    }
    return await this.postsService.findPostByTitleSlice(
      payload.title,
      payload.startPage,
      payload.perPage,
    );
  }

  //find by body content
  @Post('find_desc')
  async findDescription(@Body() payload: GetPostsScliceDto) {
    if (!payload.body) {
      throw new BadRequestException(
        'Please provide the wanted post body',
      );
    }
    return await this.postsService.findPostByDescriptionSlice(
      payload.body,
      payload.startPage,
      payload.perPage,
    );
  }

  @Post('find_by_user')
  async getPostsByAuthor(@Body() payload: GetPostsScliceDto) {
    if (!payload.userId)
      return new BadRequestException('Please provide the userID');

    const userValid = await this.usersService.findUserById(payload.userId);
    if (!userValid) throw new HttpException('User not found', 404);

    const reelsSlice = await this.postsService.findPostByAuthorIdSlice(
      payload.userId,
      payload.startPage,
      payload.perPage,
    );

    if (reelsSlice.data.length == 0)
      throw new HttpException('No posts found', 404);

    return reelsSlice;
  }

  /// EVERYTHING ABOUT COMMENTS ARE BELOW
  @Post('comment')
  async commentPost(@Body() payload: CommentPostDto) {
    const { error } = await this.commentsService.createComment(payload);
    return {
      error: error,
      message: error
        ? 'An error occured when creating the comment'
        : 'Successfully created the comment',
    };
  }

  // Returning just first level comments (Not sub comments)
  @Post('get_coms')
  async getComments(@Body() payload: GetComsDto) {
    const functionsToCall: Function[] = [
      this.commentsService.getAll.bind(this.commentsService),
      this.commentsService.orderedByPertinence.bind(this.commentsService),
      this.commentsService.orderedByDate.bind(this.commentsService),
    ];
    const order = ['all', 'pertinence', 'date'].indexOf(payload.comsOrder);

    const comments: CommentsSlice = await functionsToCall[order](
      payload.postId,
      payload.currentPage,
      payload.perPage,
      payload.asc,
    );

    if (comments.data.length === 0) {
      return {
        message: 'No comments for now',
      };
    }
    return comments;
  }

  @Post('sub_comments')
  async getSubComments(@Body() payload: GetSubCommentsDto) {
    const subComments = await this.commentsService.getSubComments(
      payload.parentCommentId,
      payload.currentPage,
      payload.perPage,
    );

    if (subComments.data.length === 0) {
      return { message: 'No sub comments' };
    }

    return subComments;
  }

  @Post('save_post')
  async savePost(
    @Body() { postId }: SavePostDto,
    @Req() request: ViktooRequest,
  ) {
    const successSaving = await this.postsService.savePost(
      postId,
      request.user?.userId,
    );

    if (successSaving === null) {
      return {
        error: true,
        success: false,
        message: 'Post already saved',
      };
    }

    return successSaving
      ? { error: false, success: true, message: 'Successfully saved post' }
      : { error: true, success: false, message: 'Failed to save the post' };
  }

  @Post('delete_saved_post')
  async deleteSavedPost(
    @Body() { postId }: { postId: string },
    @Req() request: ViktooRequest,
  ) {
    const successDeleted = await this.postsService.deleteSavedPost(
      postId,
      request.user?.userId,
    );

    return successDeleted
      ? {
          error: false,
          success: true,
          message: 'Successfully deleted saved post',
        }
      : {
          error: true,
          success: false,
          message: 'Failed to delete saved post',
        };
  }

  @Post('get_saved_posts')
  async getSavedPosts(
    @Body() { currentPage, perPage }: { currentPage: number; perPage: number },
    @Req() request: ViktooRequest,
  ) {
    if (!request.user?.userId) {
      return {
        error: true,
        message: 'Please log in before getting saved posts',
      };
    }

    const savedPosts = await this.postsService.getSavedPost(
      currentPage,
      perPage,
      request.user.userId,
    );

    return savedPosts;
  }
}
