import { Expose } from "class-transformer";

type UserType = {
  userId: string;
  name: string;
}

export class ConversationEntity {
  @Expose() 
  conversationId: string;
  
  @Expose() 
  users: UserType[];

  @Expose()
  messages: {
    users: UserType[],
    content: string;
  }

  constructor(init?: Partial<ConversationEntity>) {
    Object.assign(this, init);
  }

}