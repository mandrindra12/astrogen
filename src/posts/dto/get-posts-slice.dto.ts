import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class GetPostsScliceDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsNumber() @Min(0) startPage!: number;
  @IsNumber() @Min(1) perPage!: number;
  @IsOptional() @IsNotEmpty() title?: string;
  @IsOptional() @IsNotEmpty() body?: string;
  @IsOptional() @IsBoolean() saved?: boolean = false;
}
