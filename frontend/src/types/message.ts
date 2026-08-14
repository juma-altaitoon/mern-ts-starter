export interface Message {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  content: string;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateMessagePayload = {
  name: string;
  email: string;
  content: string;
};
