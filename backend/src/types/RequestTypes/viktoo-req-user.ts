import { Expose } from 'class-transformer';
import { UserAccountTypeEnum } from '../../enums/user-account-type.enum';
import { GenderEnum } from '../../enums/gender.enum';

export class ViktooReqUser {
  @Expose() email?: string;
  @Expose() userId?: string;
  @Expose() name?: string | null;
  @Expose() gender?: string;
  @Expose() created_at?: Date;
  @Expose() profile_photo_url?: string;
  @Expose() cover_photo_url?: string;
  @Expose() user_account_type?: UserAccountTypeEnum;
  @Expose() stars?: number;
  @Expose() followersNumber?: number;
  @Expose() followingsNumber?: number;
  @Expose() bio?: string;

  constructor(init?: Partial<ViktooReqUser>) {
    Object.assign(this, init);
  }
}
