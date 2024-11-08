import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  senderId?: string;
  
  @IsNotEmpty()
  @IsString()
  receiverId!: string;

  @IsNotEmpty()
  content!: string;
}