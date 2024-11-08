import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  senderId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  @MaxLength(36)
  recipientId!: string;
  
  @IsNotEmpty()
  @MinLength(2)
  content!: string;
  
  @IsDate()
  date?: string;
}