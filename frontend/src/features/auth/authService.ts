import api from '@/lib/api';

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country?: string;
  city?: string;
  dateOfBirth?: string;
  avatar?: string;
};

export type SigninPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export const signup = async (payload: SignupPayload) => {
  const { data } = await api.post('/auth/signup', payload);
  return data;
};

export const signin = async (payload: SigninPayload) => {
  const { data } = await api.post('/auth/signin', payload);
  return data;
};

export const signout = async () => {
  const { data } = await api.post('/auth/signout');
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post('/auth/forgot-password', payload);
  return data;
};
