import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateConversationDto {
  @IsString()
  @MinLength(36)
  @MaxLength(36)
  senderId!: string;

  @IsString()
  @MinLength(36)
  @MaxLength(36)
  recipientId!: string;

  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  content!: string;
}