import api from '@/lib/api';
import type { User } from '@/types/user';
import type { Message } from '@/types/message';

export type UserListResponse = {
  message: string;
  users: User[];
};

export type MessageListResponse = {
  message: string;
  messages: Message[];
};

export const getUsers = async () => {
  const { data } = await api.get<UserListResponse>('/user/list');
  return data;
};

export const getMessages = async () => {
  const { data } = await api.get<MessageListResponse>('/message/list');
  return data;
};
