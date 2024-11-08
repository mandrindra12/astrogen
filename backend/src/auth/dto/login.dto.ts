import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  password!: string;
}
