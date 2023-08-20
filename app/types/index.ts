import { Conversation, Message, User } from '@prisma/client';

export type AuthVariant = 'LOGIN' | 'REGISTER';

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
