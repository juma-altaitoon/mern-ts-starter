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

export type SigninWithOtpPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  token: string;
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

export const signinWithOTP = async (payload: SigninWithOtpPayload) => {
  const { data } = await api.post('/auth/signin-otp', payload);
  return data;
};

export const resendOTP = async (payload: SigninWithOtpPayload) => {
  const { data } = await api.post('/auth/resend-otp', payload);
  return data;
};

export const verifyOTP = async (payload: VerifyOtpPayload) => {
  const { data } = await api.post('/auth/verify-otp', payload);
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post('/auth/reset-password', payload);
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
