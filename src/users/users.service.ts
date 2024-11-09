import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { instanceToInstance, plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
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
    return this.prisma.users.create({ data: createUserDto });
  }

  async findOne(email: string): Promise<UserEntity | null> {
    const userData: any | null = await this.prisma.users.findUnique({
      where: { email },
    });

    const userEntity: UserEntity = instanceToInstance(
      new UserEntity(userData ?? null),
      {
        excludeExtraneousValues: true,
      },
    );
    return userEntity;
  }

  async findUserById(userId: string) {
    try {
      const user =  await this.prisma.users.findUnique({
          where: {user_id: userId},
      });
      const userEntity = plainToInstance(UserEntity, user);
      userEntity.joinDate = user.created_at;
      return userEntity;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Invalid user id, please enter a valid uuid',
      );
    }
  }

  async updateUser(email: string, payload: UpdateUserDto) {
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 6);
    }
    const user = await this.prisma.users.update({
      where: { email },
      data: payload,
    });
    return user;
  }

  async updateProfilePhoto(email: string, profilePhoto: Express.Multer.File) {
    const url = await this.uploadService.uploadFile(profilePhoto);
    if (!url) return false;
    const updated = await this.prisma.users.update({
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

    const updated = await this.prisma.users.update({
      where: { email },
      data: {
        cover_photo_url: url,
      },
    });
    return updated ? true : false;
  }
}
