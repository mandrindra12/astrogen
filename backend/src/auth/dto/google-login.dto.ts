import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name?: string;

  @IsStrongPassword()
  password?: string;
}
