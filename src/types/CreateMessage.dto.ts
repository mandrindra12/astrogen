import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  senderId?: string;
  
  @IsNotEmpty()
  @IsString()
  recipientId!: string;

  @IsNotEmpty()
  content!: string;
}