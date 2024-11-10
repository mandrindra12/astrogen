import { Body, Controller, Get, HttpException, Logger, Param, ParseUUIDPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateConversationDto } from '../types/CreateConversation.dto';
import { CreateMessageDto } from '../types/CreateMessage.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  private logger = new Logger(ChatController.name)
  constructor(private readonly chatService: ChatService) {}
  // send a message (register the content in the DB)
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post(':conversationId')
  async newMessage(@Param('conversationId', ParseUUIDPipe) conversationId: string, @Body() body: CreateMessageDto) {
    const sentMessage = await this.chatService.sendMessage(body, conversationId);
    return sentMessage;
  }

  // creates a new empty conversation
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createConversation(@Body() messageBody: CreateConversationDto) {
    const createdConversation = await this.chatService.createConversation(messageBody);
    this.logger.debug(createdConversation);
    if(createdConversation.error) {
      throw new HttpException('failed to create message', 500);
    } else {
      return createdConversation;
    }
 }

  // get all conversations related to a user
  @UseGuards(JwtGuard)
  @Get('get-conversations/:userId')
  async getConverstations(@Param('userId') userId: string) {
    const conversations = await this.chatService.getConversations(userId);
    return conversations;
  }

  // get all message related to a conversation
  @UseGuards(JwtGuard)
  @Get(':conversationId')
  async getConversation(@Param('conversationId') conversationId: string) {
    const mess = await this.chatService.getAllMessage(conversationId);
    return mess;
  }
}
