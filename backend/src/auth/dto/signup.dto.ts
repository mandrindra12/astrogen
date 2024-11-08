import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';
import { GenderEnum } from '../../enums/gender.enum';
import { UserAccountTypeEnum } from '../../enums/user-account-type.enum';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name?: string;

  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsNotEmpty()
  gender?: GenderEnum;

  @IsOptional()
  @IsNotEmpty()
  accountType?: UserAccountTypeEnum;
}
