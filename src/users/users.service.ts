import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { instanceToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async encryptPassword(password: string): Promise<string> {
    // salt is 6
    return await bcrypt.hash(password, 6);
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);
    if (!createUserDto.name) {
      createUserDto.name = createUserDto.email.split('@')[0];
    }
    return this.prismaService.users.create({ data: createUserDto });
  }

  async findOne(email: string): Promise<UserEntity | null> {
    const userData: any | null = await this.prismaService.users.findUnique({
      where: { email },
      include: { followers: true, followings: true },
    });

    const userEntity: UserEntity = instanceToInstance(
      new UserEntity(userData ?? null),
      {
        excludeExtraneousValues: true,
      },
    );
    return userEntity;
  }

  async findUserById(userId: string): Promise<UserEntity | null> {
    try {
      const userData: any | null = await this.prismaService.users.findUnique({
        where: { user_id: userId },
        include: { followers: true, followings: true },
      });
      if (!userData) return null;

      const userEntity: UserEntity = instanceToInstance(
        new UserEntity(userData ?? null),
        {
          excludeExtraneousValues: true,
        },
      );
      return userEntity;
    } catch (error) {
      throw new BadRequestException(
        'Invalid user id, please enter a valid uuid',
      );
    }
  }

  async updateUser(email: string, payload: UpdateUserDto) {
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 6);
    }
    const user = await this.prismaService.users.update({
      where: { email },
      data: payload,
    });
    return user;
  }

  async updateProfilePhoto(email: string, profilePhoto: Express.Multer.File) {
    const url = await this.uploadService.uploadFile(profilePhoto);
    if (!url) return false;
    const updated = await this.prismaService.users.update({
      where: { email },
      data: {
        profile_photo_url: url,
      },
    });
    return updated ? true : false;
  }

  async updateCoverPhoto(email: string, coverPhoto: Express.Multer.File) {
    const url = await this.uploadService.uploadFile(coverPhoto);
    if (!url) return false;

    const updated = await this.prismaService.users.update({
      where: { email },
      data: {
        cover_photo_url: url,
      },
    });
    return updated ? true : false;
  }
}
