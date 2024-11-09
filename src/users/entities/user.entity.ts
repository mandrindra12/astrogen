import { Expose } from 'class-transformer';
import { UserAccountTypeEnum } from '../../enums/user-account-type.enum';

export class UserEntity {
  @Expose() user_id?: string;
  @Expose() email!: string;
  @Expose() name?: string;
  @Expose() password!: string;
  @Expose() joinDate?: Date;
  @Expose() gender!: string;
  @Expose() user_account_type?: UserAccountTypeEnum;
  // @Expose() profile_photo_url?: string;
  // @Expose() cover_photo_url?: string;
  // @Expose() stars?: number;
  // @Expose() followers!: string[];
  // @Expose() followings!: string[];
  @Expose() friends: string[]
  @Expose() bio?: string;
  @Expose() avatar?: string;
  @Expose() localtion?: string;
  @Expose() occupation?: string;
  @Expose() postsNumber: number;

  constructor(init?: Partial<UserEntity>) {
    Object.assign(this, init);
  }
  
}
