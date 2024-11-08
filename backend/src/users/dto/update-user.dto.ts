import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserAccountTypeEnum } from '../../enums/user-account-type.enum';
import { GenderEnum } from '../../enums/gender.enum';

export class UpdateUserDto {
  @Expose() @IsOptional() @IsEmail() email?: string;
  @Expose() @IsOptional() @IsNotEmpty() bio?: string;
  @Expose() @IsOptional() @IsNotEmpty() name?: string;

  @Expose()
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @Expose() @IsOptional() user_account_type?: UserAccountTypeEnum;
  @Expose() @IsOptional() gender?: GenderEnum;

  constructor(init?: Partial<UpdateUserDto>) {
    Object.assign(this, init);
  }
}
