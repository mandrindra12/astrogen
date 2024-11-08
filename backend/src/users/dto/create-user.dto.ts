import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';
import { GenderEnum } from '../../enums/gender.enum';

export class CreateUserDto {
  @IsEmail() email!: string;
  @IsNotEmpty() @IsOptional()  name?: string;
  @IsNotEmpty() @IsOptional() gender?: GenderEnum;
  @IsStrongPassword() password!: string;
}
