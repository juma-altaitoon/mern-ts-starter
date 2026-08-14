import api from '@/lib/api';
import type { CreateMessagePayload } from '@/types/message';

export type CreateMessageResponse = {
  message: string;
};

export const createMessage = async (payload: CreateMessagePayload) => {
  const { data } = await api.post<CreateMessageResponse>('/message/create', payload);
  return data;
};
