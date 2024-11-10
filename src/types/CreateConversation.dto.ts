import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateConversationDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  senderId!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  recipientId!: string;
}