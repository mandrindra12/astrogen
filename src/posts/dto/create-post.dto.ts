import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  // @IsEmail() authorEmail!: string;
  @IsNotEmpty() title!: string;
  @IsOptional() @IsNotEmpty() body?: string;
  @IsOptional() @IsNotEmpty() category?: string;
  @IsOptional() @IsNotEmpty() price?: string;
}
