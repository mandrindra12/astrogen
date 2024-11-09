import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ViktooRequest } from '../types/RequestTypes/viktoo-request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('user_infos/:userId')
  async userInfos(
    @Param('userId') userId: string
  ) {
    // if (!payload.email) {
    //   return (
    //     (await this.usersService.findUserById(payload.userId)) ?? {
    //       error: 'User not found',
    //     }
    //   );
    // }
    // return (
    //   (await this.usersService.findOne(payload.email)) ?? {
    //     error: 'User not found',
    //   }
    // );
    const { password, ...user } = await this.usersService.findUserById(userId);

    return user;
  }

  @Post('update_user')
  async updateUser(
    @Req() request: ViktooRequest,
    @Body() payload: UpdateUserDto,
  ) {
    if (!request.user?.email) {
      throw new HttpException('Please log in before updating profile', 403);
    }
    const updated = await this.usersService.updateUser(
      request.user.email,
      payload,
    );
    if (!updated) {
      throw new HttpException('An error occured when updating user infos', 0);
    }
    return updated;
  }

  @UseInterceptors(FileInterceptor('profile_photo'))
  @Post('update_profile_photo')
  async updateProfilePhoto(
    @Req() request: ViktooRequest,
    @UploadedFile() profilePhoto: Express.Multer.File,
  ) {
    if (!request.user?.email) {
      return { error: true, message: 'session expired, please log in' };
    }

    const updated = await this.usersService.updateProfilePhoto(
      request.user.email,
      profilePhoto,
    );
    if (!updated) {
      return {
        error: true,
        message: 'An error occured when updating profile photo',
      };
    }
    return { error: false, message: 'successfully updated profile photo' };
  }

  @UseInterceptors(FileInterceptor('cover_photo'))
  @Post('update_cover_photo')
  async updateCoverPhoto(
    @Req() request: ViktooRequest,
    @UploadedFile() coverPhoto: Express.Multer.File,
  ) {
    if (!request.user?.email) {
      return { error: true, message: 'session expired, please log in' };
    }

    const updated = await this.usersService.updateCoverPhoto(
      request.user.email,
      coverPhoto,
    );

    if (!updated) {
      return {
        error: true,
        message: 'An error occured when updating cover photo',
      };
    }
    return { error: false, message: 'successfully updated cover photo' };
  }
}
