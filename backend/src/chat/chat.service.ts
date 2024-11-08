import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
import { CreateMessageDto } from '../types/CreateMessage.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {}
  // send a new message
  async sendMessage(messageBody: CreateMessageDto, conversation_id: string) {
    try {
      const { senderId } = messageBody;
      const [existingConversation, existingUser] = await Promise.all([
        this.prisma.conversations.findUnique({
          where: {
            conversation_id,
          },
        }),
        this.prisma.users.findUnique({
          where: {
            user_id: senderId,
          },
        }),
      ]);
      if (!existingConversation) {
        throw new Error("la conversation n'existe pas");
      }
      if (!existingUser) {
        throw new Error("l'emetteur n'existe pas!");
      }
      const updatedConversation = await this.prisma.conversations.update({
        where: {
          conversation_id,
        },
        data: {
          messages: {
            create: {
              recipient_id: messageBody.receiverId,
              content: messageBody.content,
              sender_id: senderId!,
              users: {
                connect: {
                  user_id: senderId!,
                },
              },
            },
          },
        },
        select: {
          conversation_id: true,
          messages: {
            select: {
              content: true,
            },
            orderBy: {
              created_at: 'asc',
            },
          },
          users: {
            select: {
              name: true,
            },
          },
        },
      });
      this.socketService.server
        .to(conversation_id)
        .emit('new-message', messageBody);
      return {
        error: false,
        conversation: updatedConversation.conversation_id,
        message: 'Envoyer avec succes!',
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
  
  // idk what dis does
  async createConversation(senderId: string, recipientId: string) {
    try {
      const [recipientExists, senderExists] = await Promise.all([
        this.prisma.users.findUnique({
          where: {
            user_id: recipientId,
          },
        }),
        this.prisma.users.findUnique({
          where: {
            user_id: senderId,
          },
        }),
      ]);
      if (!recipientExists) {
        throw new Error("le destinataire n'existe pas!");
      }
      if (!senderExists) {
        throw new Error("l'emetteur n'existe pas!");
      }
      const createdConversation = await this.prisma.conversations.create({
        data: {
          users: {
            connect: [
              {
                user_id: recipientId,
              },
              {
                user_id: senderId,
              },
            ],
          },
        },
      });
      return {
        error: false,
        conversationId: createdConversation.conversation_id,
        message: 'la conversation a ete creee',
      };
    } catch (e: any) {
      this.logger.error('this error occurs', e);
      return {
        error: true,
        message: e.message,
        conversationId: undefined,
      };
    }
  }
  // return all the members of a conversation
  async getAllMessage(conversation_id: string) {
    try {
      const conversation = await this.prisma.conversations.findUnique({
        where: {
          conversation_id,
        },
      });
      if (!conversation) {
        throw new Error('Cannot find conversation');
      }
      const messages = await this.prisma.conversations.findUnique({
        where: {
          conversation_id,
        },
        select: {
          messages: {
            select: {
              content: true,
              sender_id: true,
              created_at: true,
              users: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      return messages;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
  // return all conversation that this user has
  async getConversations(user_id: string) {
    const users = await this.prisma.users.findMany({
      where: {
        user_id,
      },
      select: {
        conversations: {
          select: {
            conversation_id: true,
            users: {
              select: {
                name: true,
                user_id: true,
              },
            },
            messages: {
              select: {
                content: true,
                message_id: true,
                users: {
                  select: {
                    user_id: true,
                    name: true,
                  },
                },
              },
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
          orderBy: {
            updated_at: 'desc',
          },
        },
      },
    });
    return users;
  }
}
